const fs = require("fs");
const path = require("path");

const uniquePaths = (items) => [...new Set(items.filter(Boolean).map((item) => path.resolve(item)))];

const resolveDefaultUploadDir = () => {
  const cwd = process.cwd();
  const cwdName = path.basename(cwd).toLowerCase();

  // Render services often run with cwd set to /.../server when rootDir=server.
  if (cwdName === "server") {
    return path.join(cwd, "uploads");
  }

  // Local dev from repository root.
  return path.join(cwd, "server", "uploads");
};

const getUploadDir = () => {
  if (process.env.UPLOAD_DIR?.trim()) {
    return path.resolve(process.env.UPLOAD_DIR.trim());
  }
  return resolveDefaultUploadDir();
};

const ensureUploadDir = () => {
  const dir = getUploadDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const getLegacyUploadDirs = (primaryDir = getUploadDir()) => {
  const cwd = process.cwd();
  return uniquePaths([path.join(cwd, "server", "uploads"), path.join(cwd, "uploads")]).filter(
    (dir) => path.resolve(dir) !== path.resolve(primaryDir)
  );
};

const getAllUploadDirs = () => {
  const primary = getUploadDir();
  return uniquePaths([primary, ...getLegacyUploadDirs(primary)]);
};

module.exports = {
  getUploadDir,
  ensureUploadDir,
  getLegacyUploadDirs,
  getAllUploadDirs
};

