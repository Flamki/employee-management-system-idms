const jwt = require("jsonwebtoken");

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h"
  });

const setAuthCookie = (res, token) => {
  const name = process.env.COOKIE_NAME || "token";
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie(name, token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000
  });
};

module.exports = { signToken, setAuthCookie };
