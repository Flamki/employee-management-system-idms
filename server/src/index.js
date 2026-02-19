const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const seedAdmin = require("./config/seedAdmin");

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();