const Project = require("../models/Project");
const userController = require("../controllers/userController");
require("dotenv").config();
const { check, validationResult } = require("express-validator");



exports.createProject = async (req, res) => {
  try {
    const { projectName } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // Get the userId from cookies
    let userId = req.cookies["userId"];

    if (!userId) {
      // If userId is not present in cookies then return error
      return res.status(401).send({ message: "User not logged in!" });
    } else {
      // Check if the user exists
      const user = await userController.verifyUserById(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found!" });
      }
      
    }
    // Check if User already has a project
    const project = await Project.findOne({ userId });
    if (project) {
      return res.status(401).send({ message: "User already has a project!" });
    }

    const newProject = {
      userId: userId,
      projectName,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from Current Date
    };

    const createdProject = await Project.create(newProject);
    res.status(200).send({ message: "Project created successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Some error occurred. Try Again!" });
  }
};




exports.deleteProject = async (req, res) => {
  try {
    let userId = req.cookies["userId"];

    // Validate User
    if (!userId) {
      return res.status(401).send({ message: "User not logged in!" });
    } else {
      const user = await userController.verifyUserById(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found!" });
      }
    }
    // Check if User has a project
    const project = await Project.findOne({ userId });
    if (!project) {
      return res.status(404).send({ message: "User doesn't have a Project!" });
    }
    await project.deleteOne();
    res.status(200).send({ message: "Project deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Some error occurred. Try Again!" });
  }
};


// Get project by userId 
exports.getProjectByUserId = async (req, res) => {
    try {
        let userId = req.cookies["userId"];
    
        // Validate User
        if (!userId) {
        return res.status(401).send({ message: "User not logged in!" });
        } else {
        const user = await userController.verifyUserById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }
        }
        // Check if User has a project
        const project = await Project.findOne({ userId });
        if (!project) {
        return res.status(404).send({ message: "User doesn't have a Project!" });
        }
        res.status(200).send(project);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Some error occurred. Try Again!" });
    }
    }