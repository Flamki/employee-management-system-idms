const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    department: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    photoPath: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);