const mongoose = require("mongoose");

const READY_STATE_LABELS = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

const getDatabaseStatus = () => {
  const { readyState, name, host, port } = mongoose.connection;

  return {
    readyState,
    status: READY_STATE_LABELS[readyState] || "unknown",
    name: name || null,
    host: host || null,
    port: port || null,
  };
};

module.exports = {
  connectDB,
  getDatabaseStatus,
};
