/**
 * Validates the environment configuration required by the application.
 *
 * Why this matters:
 * Missing or invalid configuration can cause unpredictable failures at runtime.
 * Validating it once during startup makes configuration errors easier to diagnose.
 *
 * How it works:
 * Zod reads process.env, applies defaults, and the app exits immediately if a
 * required variable is missing or malformed. No other file reads process.env
 * for application settings; they import this module instead.
 */
const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  PORT: z.coerce.number().int().min(1).max(65535).default(5000),

  FRONTEND_URL: z.string().url().default("http://localhost:5173"),

  // A MongoDB connection string is required before the server can start.
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  // NEW: secret used to sign login tokens (JWT).
  // There is intentionally NO default value: a guessable default secret would
  // let anyone forge a token. 32+ characters keeps brute-forcing impractical.
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long"),

  // NEW: how long a login token stays valid (examples: "1d", "12h", "7d").
  // Short lifetimes limit the damage if a token is ever leaked.
  JWT_EXPIRES_IN: z.string().min(2).default("1d"),
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