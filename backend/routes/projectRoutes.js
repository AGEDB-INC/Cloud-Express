const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { check, validationResult } = require("express-validator");
require("dotenv").config();
const projectController = require("../controllers/projectController");

// Create New Project
router.post(
  "/create",
  [
    check("projectName", "Please Enter a Valid Project Name").not().isEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  projectController.createProject
);

// Delete Project
router.delete("/delete", projectController.deleteProject);
// Get Project By User ID 
router.get("/id", projectController.getProjectByUserId);



module.exports = router;

