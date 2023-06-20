const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { expressjwt } = require("express-jwt");
require('dotenv').config()
// const mysql = require('mysql2');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const db = require('./models');

app.use(cors({
        // Change this to Client URL when deployed
  origin: 'http://localhost:3000', 
  credentials: true // allow cookies
}));

  // Stores JWT in cookies
  app.use(
    expressjwt({
      secret: process.env.SECRET_KEY,
      algorithms: ["HS256"],
      getToken: (req) => req.cookies.token,
    }).unless({ path: ["/user/login", "/user/signup"] })
  );

  // Global Error Handling for JWT
  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid or No Authorization Token Provided!');
    }
});

  app.use('/user', require('./routes/userRoutes'));

  const PORT = process.env.PORT || 4001;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
});