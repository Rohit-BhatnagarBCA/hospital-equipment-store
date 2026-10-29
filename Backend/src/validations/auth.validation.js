/**
 * Validation schemas for authentication endpoints.
 *
 * `.strict()` rejects unknown fields. This is important for register: a client
 * cannot sneak in `"role": "admin"` because unknown keys cause a 400 error.
 */
const { z } = require("zod");

// Trim + lowercase first, then check that it is a valid email address.
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address").max(254));

// bcrypt only uses the first 72 bytes of a password, so longer is pointless.
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

// Login does not re-check password strength; it only needs a non-empty value.
const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1).max(72),
  })
  .strict();

module.exports = {
  registerSchema,
  loginSchema,
};