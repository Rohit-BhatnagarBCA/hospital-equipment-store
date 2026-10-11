
/**
 * Validates the environment configuration required by the application.
 *
 * Why this matters:
 * Missing or invalid configuration can cause unpredictable failures at runtime.
 * Validating it once during startup makes configuration errors easier to diagnose.
 */
const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  PORT: z.coerce.number().int().min(1).max(65535).default(5000),

  FRONTEND_URL: z.string().url().default("http://localhost:5173"),

  // A MongoDB connection string is required before the server can start.
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:");

  // Report variable names and validation issues, but never print secret values.
  console.error(result.error.issues.map((issue) => ({
    variable: issue.path.join("."),
    message: issue.message,
  })));

  process.exit(1);
}

module.exports = result.data;
