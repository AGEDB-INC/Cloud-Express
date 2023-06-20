const User = require('../models/User');
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()


    // Registering a User
exports.registerUser = async (req, res) => {

    try {
    const { firstName, lastName, email, password, companyName } = req.body;

    if (!firstName || !lastName || !email || !password || !companyName) {
        return res.status(400).send({ message: "All fields are required." });
    }

    const countQuery = "SELECT COUNT(*) AS count FROM Users WHERE email = ?";
    const countResult = await db.sequelize.query(countQuery, {
      replacements: [email],
      });

    const count = countResult[0][0].count;
    if (count > 0) {
      return res.status(400).send({ message: "User already exists." });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const query = "INSERT INTO Users (firstName, lastName, email, password, companyName) VALUES (:firstName, :lastName, :email, :hashedPassword, :companyName)";
    const replacements = { firstName, lastName, email, hashedPassword, companyName };

    const [results] = await db.sequelize.query(query, { replacements });
    console.log(results);

    res.status(200).send("User registered successfully.");

    } catch(err) {
        console.log(err);
    }
}

    // Logging In a User
exports.login = async (req, res) => {
    try {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).send({ message: "All fields are required." });
    }

    const query = "SELECT * FROM Users WHERE email = ?";
    const [results] = await db.sequelize.query(query, {
        replacements: [email],
    });
    console.log(results);
    if (results[0].length === 0) {
        return res.status(401).send("Invalid credentials!");
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).send("Invalid credentials!");
    }


    // Creating Auth Token and Storing it in Cookies 
    const token = jwt.sign({ userEmail: email }, process.env.SECRET_KEY);
    // res.cookie('token', token, { httpOnly: true, secure: true });
    res.cookie('token', token, { sameSite: 'none', secure: true });

    res.status(200).send({ token, message: "User logged in successfully." });

} catch(err) {
    res.status(500).send({ message: "An error occurred." });
    console.log(err);
    }
}


// Logging Out a User -- Clearing Token Cookie
exports.logout = async (req, res) => {
    try {
        // Clearing Token from Cookies So no more calls to the DB can be made
    res.clearCookie('token');
    res.send({ message: "User logged out successfully." });

    } catch(err) {
        console.log(err);
    }
}


exports.getAllUsers = async (req, res) => {

    try {
    const query = "SELECT * FROM Users";
    const [results, metadata] = await db.sequelize.query(query);
    // console.log(results);
    // console.log(metadata);

    res.send(results);
    }
    catch (err) {
        console.log(err);
    }

}





        
