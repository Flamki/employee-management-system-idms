const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const { body, param, query } = require("express-validator");

const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

const allowedDepartments = ["HR", "Engineering", "Finance", "Marketing", "Operations", "Admin"];
const allowedDesignations = ["Intern", "Executive", "Manager", "Senior Manager", "Lead", "Director"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), "server", "uploads")),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    return cb(null, true);
  }
});

const removeUploadedPhoto = (photoPath) => {
  if (!photoPath) return;
  const relativePhotoPath = photoPath.replace(/^\/+/, "");
  const absolutePhotoPath = path.join(process.cwd(), "server", relativePhotoPath);
  if (fs.existsSync(absolutePhotoPath)) {
    fs.unlinkSync(absolutePhotoPath);
  }
};

router.get(
  "/",
  authMiddleware,
  [
    query("search").optional().isString(),
    query("department").optional().isString(),
    query("designation").optional().isString(),
    query("gender").optional().isString()
  ],
  validateRequest,
  async (req, res) => {
    const { search = "", department = "", designation = "", gender = "" } = req.query;

    const filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ fullName: regex }, { email: regex }, { department: regex }];
    }

    if (department) filter.department = department;
    if (designation) filter.designation = designation;
    if (gender) filter.gender = gender;

    const employees = await Employee.find(filter).sort({ createdAt: -1 });

    return res.json({
      employees,
      meta: {
        departments: allowedDepartments,
        designations: allowedDesignations,
        genders: ["Male", "Female", "Other"]
      }
    });
  }
);

router.post(
  "/",
  authMiddleware,
  upload.single("photo"),
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("dob").isISO8601().withMessage("Date of birth is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phoneNumber").matches(/^\d{10}$/).withMessage("Phone number must be exactly 10 digits"),
    body("department").isIn(allowedDepartments).withMessage("Department must be selected from dropdown"),
    body("designation").isIn(allowedDesignations).withMessage("Designation must be selected from dropdown"),
    body("gender").isIn(["Male", "Female", "Other"]).withMessage("Gender is required")
  ],
  validateRequest,
  async (req, res) => {
    const exists = await Employee.findOne({ email: req.body.email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "Employee email already exists" });
    }

    const employee = await Employee.create({
      fullName: req.body.fullName,
      dob: req.body.dob,
      email: req.body.email,
      department: req.body.department,
      phoneNumber: req.body.phoneNumber,
      designation: req.body.designation,
      gender: req.body.gender,
      photoPath: req.file ? `/uploads/${req.file.filename}` : "",
      createdBy: req.user.userId
    });

    return res.status(201).json({ employee });
  }
);

router.put(
  "/:employeeId",
  authMiddleware,
  upload.single("photo"),
  [
    param("employeeId").isMongoId().withMessage("Invalid employee id"),
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("dob").isISO8601().withMessage("Date of birth is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phoneNumber").matches(/^\d{10}$/).withMessage("Phone number must be exactly 10 digits"),
    body("department").isIn(allowedDepartments).withMessage("Department must be selected from dropdown"),
    body("designation").isIn(allowedDesignations).withMessage("Designation must be selected from dropdown"),
    body("gender").isIn(["Male", "Female", "Other"]).withMessage("Gender is required")
  ],
  validateRequest,
  async (req, res) => {
    const employee = await Employee.findById(req.params.employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const normalizedEmail = req.body.email.toLowerCase();
    const duplicate = await Employee.findOne({ email: normalizedEmail, _id: { $ne: employee._id } });
    if (duplicate) {
      return res.status(409).json({ message: "Employee email already exists" });
    }

    if (req.file) {
      removeUploadedPhoto(employee.photoPath);
      employee.photoPath = `/uploads/${req.file.filename}`;
    }

    employee.fullName = req.body.fullName;
    employee.dob = req.body.dob;
    employee.email = normalizedEmail;
    employee.department = req.body.department;
    employee.phoneNumber = req.body.phoneNumber;
    employee.designation = req.body.designation;
    employee.gender = req.body.gender;

    await employee.save();
    return res.json({ employee });
  }
);

router.delete(
  "/:employeeId",
  authMiddleware,
  [param("employeeId").isMongoId().withMessage("Invalid employee id")],
  validateRequest,
  async (req, res) => {
    const employee = await Employee.findById(req.params.employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await Employee.deleteOne({ _id: employee._id });

    removeUploadedPhoto(employee.photoPath);

    return res.json({ message: "Employee deleted successfully" });
  }
);

module.exports = router;
