/**
 * MongoDB Connection
 *
 * Opens the Mongoose connection before the HTTP server starts.
 * The MongoDB URI is read from environment variables, never hardcoded.
 */

const mongoose = require("mongoose");
const env = require("./env");

async function connectDatabase() {
  // Fail early if MongoDB cannot be reached.
  await mongoose.connect(env.MONGODB_URI);

  console.log("MongoDB connected successfully");
}

module.exports = connectDatabase;