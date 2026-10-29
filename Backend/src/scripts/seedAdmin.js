/**
 * Create (or promote) an admin account
 *
 * PURPOSE:
 * Public registration only creates "customer" accounts, so the first admin
 * must be created from the command line.
 *
 * HOW TO USE (credentials come from environment variables so they are never
 * written into source code):
 *
 *   1. Add these three lines to Backend/.env (then REMOVE them afterwards):
 *        ADMIN_NAME=Rohit Admin
 *        ADMIN_EMAIL=admin@yourdomain.com
 *        ADMIN_PASSWORD=ChooseAStrongPassword#2026
 *   2. Run:  npm run seed:admin
 *
 * BEHAVIOUR:
 *  - If the email does not exist: a new admin is created.
 *  - If the email already exists: that account is promoted to admin and its
 *    password is left unchanged.
 */

require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const connectDatabase = require("../config/database");
const User = require("../models/user.model");
const { registerSchema } = require("../validations/auth.validation");

const BCRYPT_ROUNDS = 12;

async function seedAdmin() {
  // Reuse the register validation so admin passwords follow the same rules.
  const parsed = registerSchema.safeParse({
    name: process.env.ADMIN_NAME || "Administrator",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });

  if (!parsed.success) {
    console.error("Invalid ADMIN_* settings:");
    console.error(
      parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
    );
    process.exitCode = 1;
    return;
  }

  const { name, email, password } = parsed.data;

  await connectDatabase();

  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log(`Existing account promoted to admin: ${email}`);
    } else {
      console.log(`Account is already an admin: ${email}`);
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await User.create({ name, email, passwordHash, role: "admin" });
  console.log(`Admin account created: ${email}`);
}

seedAdmin()
  .catch((error) => {
    console.error("Seeding admin failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });