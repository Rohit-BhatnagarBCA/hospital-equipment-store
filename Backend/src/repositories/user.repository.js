/**
 * Performs database operations for users.
 *
 * Only this file knows that users live in MongoDB. If the database changes
 * later, services and controllers stay exactly the same.
 */

const User = require("../models/user.model");

async function createUser({ name, email, passwordHash, role = "customer" }) {
  const user = await User.create({ name, email, passwordHash, role });
  return user.toObject();
}

/**
 * Finds a user by email INCLUDING the password hash.
 * Used by login (to compare passwords) and register (to detect duplicates).
 */
async function findByEmailWithPassword(email) {
  return User.findOne({ email }).select("+passwordHash").lean();
}

/** Finds a user by id WITHOUT the password hash. */
async function findById(id) {
  return User.findById(id).lean();
}

module.exports = {
  createUser,
  findByEmailWithPassword,
  findById,
};