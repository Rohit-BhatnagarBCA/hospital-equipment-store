/**
 * Defines the MongoDB schema for application users.
 *
 * Security notes:
 * - Only a bcrypt HASH of the password is stored, never the password itself.
 * - passwordHash has `select: false`, so normal queries never return it.
 *   Code that needs it (login) must ask for it explicitly with "+passwordHash".
 * - `role` is not accepted from the public register endpoint; new accounts are
 *   always "customer". Admins are created with the seedAdmin script.
 */

const mongoose = require("mongoose");

const USER_ROLES = ["customer", "admin"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    // Stored lowercase so "A@x.com" and "a@x.com" are the same account.
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: USER_ROLES,
      default: "customer",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  }
);

module.exports = mongoose.model("User", userSchema);
module.exports.USER_ROLES = USER_ROLES;