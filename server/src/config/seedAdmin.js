const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedAdmin = async () => {
  const username = process.env.ADMIN_USERNAME || "admin";
  const email = (process.env.ADMIN_EMAIL || "admin@idms.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ username, email, passwordHash });
  console.log(`Seeded admin user: ${username}`);
};

module.exports = seedAdmin;