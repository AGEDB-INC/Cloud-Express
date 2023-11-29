const User = require("../models/User");
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt_decode = require("jwt-decode");
require("dotenv").config();
const { check, validationResult } = require("express-validator");

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
            return res
                .status(401)
                .json({ message: "Error: User already exists!" });
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
        res.status(200).send({ message: "User registered successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Some error occurred. Try Again!" });
    }
};

exports.googleSignin = async (req, res) => {
    console.log("code", req.body);
    try {
        const { code } = req.body;
        console.log("code", code);
        const CLIENT_ID =
            "786408429553-kh6msde0vcg3mmpbofj17u0nfbiqfe2a.apps.googleusercontent.com";
        const CLIENT_SECRET = "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";
        const REDIRECT_URI = "http://localhost:3000";
        const response = await axios.post(
            "https://oauth2.googleapis.com/token",
            {
                code,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: "authorization_code",
            }
        );
        console.log("response", response.data);
        const { id_token } = response.data;
        const decoded = jwt_decode(id_token);
        const { email, given_name, family_name } = decoded;
        const user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign(
                { userEmail: email },
                process.env.SECRET_KEY
            );
            res.cookie("token", token, { sameSite: "none", secure: true });
            res.cookie("userId", user._id, { sameSite: "none", secure: true });
            return res
                .status(200)
                .json({ token, user, message: "Google Sign-In success" });
        } else {
            const newUser = new User({
                email,
                firstName: given_name,
                lastName: family_name,
                password: " ",
                companyName: " ",
            });

            await newUser.save();

            const token = jwt.sign(
                { userEmail: email },
                process.env.SECRET_KEY
            );
            res.cookie("token", token, { sameSite: "none", secure: true });
            res.cookie("userId", newUser._id, {
                sameSite: "none",
                secure: true,
            });

            const username = email.split("@")[0];
            await createUserAndDatabase(username, "123456Aa", username + "_database");

            return res
                .status(200)
                .json({ message: "Google Sign-In success (new user)" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Logging In a User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Checking if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Error: Invalid Credentials!" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: "Error: Invalid Credentials!" });
        }
        const token = jwt.sign({ userEmail: email }, process.env.SECRET_KEY);
        // Stores JWT in cookies
        res.cookie("token", token, { sameSite: "none" });
        // res.cookie('token', token, { sameSite: 'none', secure: false }); // for droplet
        // Store User ID in cookies
        res.cookie("userId", user, { sameSite: "none" });

        // localStorage.setItem('email', email);
        // await createUserAndDatabase(username, password, username+"_database");
        const username = email.split("@")[0];
        await createUserAndDatabase(username, "123456Aa", username + "_database");
        // await connectUserToDatabase(username, username+"_database");

        // console.log(".............Created New User and DB.............")

        res.status(200).send({
            token,
            user,
            email: user.email,
            message: "User logged in Successfully!",
        });
    } catch (err) {
        res.status(500).send({ message: "An error occurred." });
        console.log(err);
    }
};

// Function to verify if user exists by ID or if user ID is valid
exports.verifyUserById = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (err) {
        console.error(err);
        return null;
    }
};

exports.verifyUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
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
        res.clearCookie("token");
        res.clearCookie("userId");
        res.status(200).send({ message: "User logged out successfully." });
    } catch (err) {
        console.log(err);
    }
};

// CREATE USER AND DATABASE on POSTGRES

const pgp = require("pg-promise")();
const dbConfig = {
    host: "24.199.126.236",
    port: 5432,
    database: "postgres", // Connect to the 'postgres' database for administrative tasks
    user: "database_admin",
    password: "123456Aa",
};

let dbt = pgp(dbConfig);

// Function to check if a user exists
async function userExists(username) {
    try {
        const result = await dbt.oneOrNone("SELECT usename FROM pg_user WHERE usename = $1", [username]);
        return result !== null;
    } catch (error) {
        throw error;
    }
}

// Function to create a new user with specific privileges and a new database
async function createUserAndDatabase(newUsername, newPassword, newDatabaseName) {
    try {
        // Check if the user already exists
        const userAlreadyExists = await userExists(newUsername);

        if (userAlreadyExists) {
            console.log(`User '${newUsername}' already exists.`);
            return;
        }

        await dbt.none("CREATE USER $1~ WITH PASSWORD $2", [
            newUsername,
            newPassword,
        ]);

        // Create a new database
        await dbt.none("CREATE DATABASE $1~", [newDatabaseName]);
        // Grant privileges to the new user on the new database
        await dbt.none("GRANT CONNECT ON DATABASE $1~ TO $2~", [
            newDatabaseName,
            newUsername,
        ]);
        await dbt.none("GRANT USAGE ON SCHEMA public TO $1~", [newUsername]);
        // await dbt.none('GRANT CREATE ON SCHEMA public TO $1~', [newUsername]);
        await dbt.none(
            "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $1~",
            [newUsername]
        );
        await dbt.none(
            "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO $1~",
            [newUsername]
        );
        await dbt.none("ALTER DATABASE $1~ OWNER TO $2~", [
            newDatabaseName,
            newUsername,
        ]);
        // await dbt.none('SET ROLE database_admin');
        await dbt.none("ALTER ROLE $1~ SUPERUSER", [newUsername]); // TEMP

        await dbt.none("CREATE EXTENSION IF NOT EXISTS age");
        await dbt.none("LOAD 'age'");
        await dbt.none(`SET search_path = ag_catalog, "$user", public`);

        console.log(
            `User '${newUsername}' and database '${newDatabaseName}' created successfully.`
        );
    } catch (error) {
        console.error("Error creating user and database:", error);
    }
}

// Function to execute a query in the newly created database
// async function executeQueryInNewDatabase(username, databaseName) {
//     const newDbConfig = {
//         host: "24.199.126.236",
//         port: 5432,
//         database: databaseName,
//         user: newUsername,
//         password: "123456Aa", // Replace with the actual password
//     };

//     const newDb = pgp(newDbConfig);

//     try {
//         // Execute your queries in the new database
//         // For example: await newDb.any('SELECT * FROM some_table');
//         console.log(`Query executed in database '${databaseName}'.`);
//     } catch (error) {
//         console.error("Error executing query:", error);
//     } finally {
//         // Close the connection to the new database
//         newDb.$pool.end();
//     }
// }

// Automatic reconnection
let connectionAttempts = 0; // Initialize connection attempts counter
const maxConnectionAttempts = 5; // Set the maximum number of connection attempts

function connect() {
    if (connectionAttempts >= maxConnectionAttempts) {
        console.error("Exceeded maximum connection attempts.");
        return;
    }

    dbt.connect()
        .then((obj) => {
            console.log("<---Connected to the PostgreSQL Successfully--->");
            // Release the connection when done
            obj.done();
        })
        .catch((error) => {
            console.error(
                `Connection error (Attempt ${connectionAttempts + 1
                } of ${maxConnectionAttempts}):`,
                error
            );
            connectionAttempts++; // Increment the connection attempts counter

            // Retry connection after a delay
            setTimeout(connect, 1000); // Retry connection after a 1-second delay
        });
}

// Start the initial connection
connect();


// Function to execute a query in the newly created database
async function executeQueryInNewDatabase(username, databaseName) {
  const newDbConfig = {
      host: '24.199.126.236',
      port: 5432,
      database: databaseName,
      user: username,
      password: '123456Aa', // Replace with the actual password
      // password: 'postgres', // Replace with the actual password
  };

  const newDb = pgp(newDbConfig);

  try {
      await newDb.none('SELECT create_graph($1~)', [databaseName]);
      console.log(`Query executed in database '${databaseName}'.`);
  } catch (error) {
      console.error('Error executing query:', error);
  } finally {
      // Close the connection to the new database
      newDb.$pool.end();
  }
}

// // Function to connect the user to the database (replace with your implementation)
// // function connectUserToDatabase(username, databaseName) {

// //   //  ## user connection and route to /AGCloud route
// //   console.log(`Connecting user '${username}' to database '${databaseName}'...`);
// //   // Implement your connection logic here
// // }

// // Usage: Pass the desired username, password, and database name as arguments
// // (async () => {
// //   try {
// //     await createUserAndDatabase('fast_user', 'Welcome@1', 'fast_database');
// //     connectUserToDatabase('new_user', 'new_database');
// //   } catch (error) {
// //     console.error('Error:', error);
// //   }
// // })();

// /////  -------- Sequelize Code - Commented For Future Use (If Needed) -------- /////

// //     //// Registering a User
// // exports.registerUser = async (req, res) => {

// //     try {
// //     const { firstName, lastName, email, password, companyName } = req.body;

// //     if (!firstName || !lastName || !email || !password || !companyName) {
// //         return res.status(400).send({ message: "All fields are required." });
// //     }

// //     const countQuery = "SELECT COUNT(*) AS count FROM Users WHERE email = ?";
// //     const countResult = await db.sequelize.query(countQuery, {
// //       replacements: [email],
// //       });
// //     const count = countResult[0][0].count;
// //     if (count > 0) {
// //       return res.status(400).send({ message: "User already exists." });
// //     }

// //     // Encrypt password
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

// //     const query = "INSERT INTO Users (firstName, lastName, email, password, companyName) VALUES (:firstName, :lastName, :email, :hashedPassword, :companyName)";
// //     const replacements = { firstName, lastName, email, hashedPassword, companyName };

// //     const [results] = await db.sequelize.query(query, { replacements });
// //     console.log(results);

// //     res.status(200).send("User registered successfully.");

// //     } catch(err) {
// //         console.log(err);
// //     }
// // }

// //     // Logging In a User
// // exports.login = async (req, res) => {
// //     try {

// //     const { email, password } = req.body;
// //     if (!email || !password) {
// //         return res.status(401).send({ message: "All fields are required." });
// //     }

// //     const query = "SELECT * FROM Users WHERE email = ?";
// //     const [results] = await db.sequelize.query(query, {
// //         replacements: [email],
// //     });
// //     console.log(results);
// //     if (results.length === 0) {
// //         return res.status(401).send("Invalid credentials!");
// //     }

// //     const user = results[0];
// //     const isPasswordValid = await bcrypt.compare(password, user.password);
// //     if (!isPasswordValid) {
// //         return res.status(401).send("Invalid credentials!");
// //     }

// //     // Creating Auth Token and Storing it in Cookies
// //     const token = jwt.sign({ userEmail: email }, process.env.SECRET_KEY);
// //     // res.cookie('token', token, { httpOnly: true, secure: true });
// //     res.cookie('token', token, { sameSite: 'none', secure: true });

// //     res.status(200).send({ token, message: "User logged in successfully." });

// // } catch(err) {
// //     res.status(500).send({ message: "An error occurred." });
// //     console.log(err);
// //     }
// // }

// // // Logging Out a User -- Clearing Token Cookie
// // exports.logout = async (req, res) => {
// //     try {
// //         // Clearing Token from Cookies So no more calls to the DB can be made
// //     res.clearCookie('token');
// //     res.send({ message: "User logged out successfully." });

// //     } catch(err) {
// //         console.log(err);
// //     }
// // }

// // exports.getAllUsers = async (req, res) => {

// //     try {
// //     const query = "SELECT * FROM Users";
// //     const [results, metadata] = await db.sequelize.query(query);
// //     // console.log(results);
// //     // console.log(metadata);

// //     res.send(results);
// //     }
// //     catch (err) {
// //         console.log(err);
// //     }

// // }
