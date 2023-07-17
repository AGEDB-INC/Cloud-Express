const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { expressjwt } = require('express-jwt');
const { mongoose } = require('./db');
const app = express();
require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    // TODO: Change this to Client URL when deployed
    origin: 'http://localhost:3002',
    credentials: true, // allow cookies
  })
);

// Stores JWT in cookies
app.use(
  expressjwt({
    secret: process.env.SECRET_KEY,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.token,
  }).unless({ path: ['/user/login', '/user/signup'] })
);

// Global Error Handling for JWT
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid or No Authorization Token Provided!');
  }
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`<---Server is running on port ${PORT} --->`);
});

app.use('/user', require('./routes/userRoutes'));
app.use('/project', require('./routes/projectRoutes'));

// // ----------- Sequelize Connection - Commented For Future Use (If Needed) ------------- //

// const db = require('./models');

// db.sequelize.sync().then(() => {
//     app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//     });
// });
