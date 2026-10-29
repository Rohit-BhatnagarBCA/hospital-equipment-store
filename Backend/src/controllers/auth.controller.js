/**
 * Handles HTTP input/output for authentication.
 * Business rules live in auth.service.js; this file only translates between
 * HTTP and the service.
 */

const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(res.locals.validated.body);

  res.status(201).json({ success: true, data: result });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(res.locals.validated.body);

  res.status(200).json({ success: true, data: result });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  res.status(200).json({ success: true, data: user });
});

module.exports = {
  register,
  login,
  getMe,
};