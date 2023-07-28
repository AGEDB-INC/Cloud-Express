const User = require('../models/User');
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const jwt_decode = require('jwt-decode');
require('dotenv').config();
const { check, validationResult } = require('express-validator');

// Registering a User
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, companyName } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // Checing if user exists
    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({ message: 'Error: User already exists!' });
    }
    // Encrypting password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      companyName,
    };
    await User.create(newUser);
    res.status(200).send({ message: 'User registered successfully!' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Some error occurred. Try Again!' });
  }
};
exports.googleSignin = async (req, res) => {
  console.log('code', req.body);
  try {
    const { code } = req.body;
    console.log('code', code);
    const CLIENT_ID =
      '786408429553-kh6msde0vcg3mmpbofj17u0nfbiqfe2a.apps.googleusercontent.com';
    const CLIENT_SECRET = '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';
    const REDIRECT_URI = 'http://localhost:3000';
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });
    console.log('response', response.data);
    const { id_token } = response.data;
    const decoded = jwt_decode(id_token);
    const { email, given_name, family_name } = decoded;
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ userEmail: email }, process.env.SECRET_KEY);
      res.cookie('token', token, { sameSite: 'none', secure: true });
      res.cookie('userId', user._id, { sameSite: 'none', secure: true });
      return res.status(200).json({ message: 'Google Sign-In success' });
    } else {
      const newUser = new User({
        email,
        firstName: given_name,
        lastName: family_name,
        password: ' ',
        companyName: ' ',
      });

      await newUser.save();

      const token = jwt.sign({ userEmail: email }, process.env.SECRET_KEY);
      res.cookie('token', token, { sameSite: 'none', secure: true });
      res.cookie('userId', newUser._id, { sameSite: 'none', secure: true });

      return res
        .status(200)
        .json({ message: 'Google Sign-In success (new user)' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Logging In a User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Error: Invalid Credentials!' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Error: Invalid Credentials!' });
    }
    const token = jwt.sign({ userEmail: email }, process.env.SECRET_KEY);
    // Stores JWT in cookies
    res.cookie('token', token, { sameSite: 'none', secure: true });
    // Store User ID in cookies
    res.cookie('userId', user._id, { sameSite: 'none', secure: true });

    res.status(200).send({ token, message: 'User logged in Successfully!' });
  } catch (err) {
    res.status(500).send({ message: 'An error occurred.' });
    console.log(err);
  }
};

// Function to verify if user exists by ID or if  user ID is valid
exports.verifyUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Logging Out a User -- Clearing Token Cookie
exports.logoutUser = async (req, res) => {
  try {
    // Clearing Token from Cookies So no more calls to the DB can be made
    res.clearCookie('token');
    res.clearCookie('userId');
    res.status(200).send({ message: 'User logged out successfully.' });
  } catch (err) {
    console.log(err);
  }
};

/////  -------- Sequelize Code - Commented For Future Use (If Needed) -------- /////

//     //// Registering a User
// exports.registerUser = async (req, res) => {

//     try {
//     const { firstName, lastName, email, password, companyName } = req.body;

//     if (!firstName || !lastName || !email || !password || !companyName) {
//         return res.status(400).send({ message: "All fields are required." });
//     }

//     const countQuery = "SELECT COUNT(*) AS count FROM Users WHERE email = ?";
//     const countResult = await db.sequelize.query(countQuery, {
//       replacements: [email],
//       });
//     const count = countResult[0][0].count;
//     if (count > 0) {
//       return res.status(400).send({ message: "User already exists." });
//     }

//     // Encrypt password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const query = "INSERT INTO Users (firstName, lastName, email, password, companyName) VALUES (:firstName, :lastName, :email, :hashedPassword, :companyName)";
//     const replacements = { firstName, lastName, email, hashedPassword, companyName };

//     const [results] = await db.sequelize.query(query, { replacements });
//     console.log(results);

//     res.status(200).send("User registered successfully.");

//     } catch(err) {
//         console.log(err);
//     }
// }

//     // Logging In a User
// exports.login = async (req, res) => {
//     try {

//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(401).send({ message: "All fields are required." });
//     }

//     const query = "SELECT * FROM Users WHERE email = ?";
//     const [results] = await db.sequelize.query(query, {
//         replacements: [email],
//     });
//     console.log(results);
//     if (results.length === 0) {
//         return res.status(401).send("Invalid credentials!");
//     }

//     const user = results[0];
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//         return res.status(401).send("Invalid credentials!");
//     }

//     // Creating Auth Token and Storing it in Cookies
//     const token = jwt.sign({ userEmail: email }, process.env.SECRET_KEY);
//     // res.cookie('token', token, { httpOnly: true, secure: true });
//     res.cookie('token', token, { sameSite: 'none', secure: true });

//     res.status(200).send({ token, message: "User logged in successfully." });

// } catch(err) {
//     res.status(500).send({ message: "An error occurred." });
//     console.log(err);
//     }
// }

// // Logging Out a User -- Clearing Token Cookie
// exports.logout = async (req, res) => {
//     try {
//         // Clearing Token from Cookies So no more calls to the DB can be made
//     res.clearCookie('token');
//     res.send({ message: "User logged out successfully." });

//     } catch(err) {
//         console.log(err);
//     }
// }

// exports.getAllUsers = async (req, res) => {

//     try {
//     const query = "SELECT * FROM Users";
//     const [results, metadata] = await db.sequelize.query(query);
//     // console.log(results);
//     // console.log(metadata);

//     res.send(results);
//     }
//     catch (err) {
//         console.log(err);
//     }

// }
