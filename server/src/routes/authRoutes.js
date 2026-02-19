const express = require("express");
const { body } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { signToken, setAuthCookie } = require("../config/jwt");

const router = express.Router();

router.post(
  "/login",
  [
    body("identity").trim().notEmpty().withMessage("Email or username is required"),
    body("password").trim().notEmpty().withMessage("Password is required")
  ],
  validateRequest,
  async (req, res) => {
    const { identity, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: identity }, { email: identity.toLowerCase() }]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ userId: user._id, username: user.username });
    setAuthCookie(res, token);

    return res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  }
);

router.post("/logout", (req, res) => {
  const name = process.env.COOKIE_NAME || "token";
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie(name, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction
  });
  return res.json({ message: "Logged out" });
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).select("_id username email");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user });
});

module.exports = router;
