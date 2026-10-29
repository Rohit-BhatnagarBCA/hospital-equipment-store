/**
 * Business logic for registration, login and reading the current user.
 *
 * Flow:
 *  register: hash password -> save user -> sign JWT
 *  login:    find user -> compare password hash -> sign JWT
 *
 * The service never talks to Express (no req/res) and never talks to MongoDB
 * directly (only through the repository), so it is easy to test and to reuse.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const userRepository = require("../repositories/user.repository");

// Higher = slower to crack but slower to log in. 12 is a common balance.
const BCRYPT_ROUNDS = 12;

// Same message for "unknown email" and "wrong password" so attackers cannot
// discover which emails are registered.
const INVALID_LOGIN_MESSAGE = "Invalid email or password";

/**
 * A throwaway hash used when the email does not exist.
 * We still run a bcrypt comparison so a missing account and a wrong password
 * take about the same time (prevents timing-based email discovery).
 */
let dummyHashPromise;
function getDummyHash() {
  if (!dummyHashPromise) {
    dummyHashPromise = bcrypt.hash("not-a-real-password", BCRYPT_ROUNDS);
  }
  return dummyHashPromise;
}

/** Converts a database user into the safe shape sent to the client. */
function toPublicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

/**
 * Signs a JWT. The user id goes in the standard `sub` claim.
 * The role is included only for quick UI/authorization checks.
 */
function signToken(user) {
  return jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: String(user._id),
    expiresIn: env.JWT_EXPIRES_IN,
    algorithm: "HS256",
  });
}

async function register({ name, email, password }) {
  const existing = await userRepository.findByEmailWithPassword(email);
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  let user;
  try {
    // New public accounts are always customers.
    user = await userRepository.createUser({
      name,
      email,
      passwordHash,
      role: "customer",
    });
  } catch (error) {
    // Two simultaneous sign-ups can both pass the check above; the unique
    // index on email then rejects the second one with code 11000.
    if (error && error.code === 11000) {
      throw new ApiError(409, "An account with this email already exists");
    }
    throw error;
  }

  return { user: toPublicUser(user), token: signToken(user) };
}

async function login({ email, password }) {
  const user = await userRepository.findByEmailWithPassword(email);

  const hashToCompare = user ? user.passwordHash : await getDummyHash();
  const passwordMatches = await bcrypt.compare(password, hashToCompare);

  if (!user || !passwordMatches) {
    throw new ApiError(401, INVALID_LOGIN_MESSAGE);
  }

  return { user: toPublicUser(user), token: signToken(user) };
}

async function getCurrentUser(userId) {
  const user = await userRepository.findById(userId);

  // The token is valid but the account was deleted afterwards.
  if (!user) {
    throw new ApiError(401, "Account no longer exists");
  }

  return toPublicUser(user);
}

module.exports = {
  register,
  login,
  getCurrentUser,
};