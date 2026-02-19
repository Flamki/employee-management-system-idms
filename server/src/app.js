const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

const uploadDir = path.join(process.cwd(), "server", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  if (err) {
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
  return next();
});

module.exports = app;