const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const { ensureUploadDir, getLegacyUploadDirs } = require("./config/uploads");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = origin.replace(/\/+$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

const uploadDir = ensureUploadDir();
const legacyUploadDirs = getLegacyUploadDirs(uploadDir);

app.use("/uploads", express.static(uploadDir));
legacyUploadDirs.forEach((legacyDir) => {
  if (fs.existsSync(legacyDir)) {
    app.use("/uploads", express.static(legacyDir));
  }
});
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
