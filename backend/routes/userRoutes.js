const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router.get("/", userController.getAllUsers);
router.post("/register", userController.registerUser);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

module.exports = router;
