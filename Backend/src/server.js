/**
 * Application Entry Point
 *
 * Validates configuration, connects to MongoDB, and starts the HTTP server.
 * The server does not accept requests until the database connection succeeds.
 */

require("dotenv").config();

const env = require("./config/env");
const mongoose = require("mongoose");
const app = require("./app");
const connectDatabase = require("./config/database");

async function startServer() {
  try {
    // Connect to the database before accepting API requests.
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(`API listening on port ${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });

    // Prevent multiple shutdown handlers from closing the server repeatedly.
    let isShuttingDown = false;

    const shutdown = (signal) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      console.log(`${signal} received. Closing the server...`);

      server.close(async (error) => {
        if (error) {
          console.error("HTTP server shutdown failed:", error.message);
          process.exitCode = 1;
        }

        try {
          await mongoose.disconnect();
          console.log("MongoDB connection closed");
        } catch (disconnectError) {
          console.error(
            "MongoDB shutdown failed:",
            disconnectError.message
          );
          process.exitCode = 1;
        }
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    // Log the error message without exposing environment secrets.
    console.error("Application startup failed:", error.message);
    process.exitCode = 1;
  }
}

startServer();