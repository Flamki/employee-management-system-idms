const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const name = process.env.COOKIE_NAME || "token";
  const bearer = req.headers.authorization;
  const token = req.cookies[name] || (bearer && bearer.startsWith("Bearer ") ? bearer.slice(7) : "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;