const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { expressjwt } = require('express-jwt');
const { mongoose } = require('./db');
const app = express();
require('dotenv').config();
app.use(bodyParser.json());
require('colors');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const {
  getStatusColor,
  getStatusMessageColor,
  getFormattedTimestamp,
} = require('./helpers');
app.use(
  cors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true, // Enable credentials (cookies) to be sent with the request
  })
);

const createLog = (req, res, next) => {
  const start = Date.now();

  res.on('finish', function () {
    const duration = Date.now() - start;
    const timestamp = getFormattedTimestamp();
    const method = req.method;
    const url = decodeURI(req.url);
    const statusCode = res.statusCode;
    const statusMessage = res.statusMessage;
    const agent = req.get('User-Agent');
    const coloredStatus = getStatusColor(statusCode);
    const coloredStatusMessage = getStatusMessageColor(statusMessage);

    console.log(
      `[${timestamp}] ${coloredStatus} ${method} ${url} - ${statusCode} ${coloredStatusMessage} (${duration}ms) - Agent: ${agent}`
    );
  });

  next();
};

app.use(createLog);

app.use(
  expressjwt({
    secret: process.env.SECRET_KEY,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.token,
  }).unless({ path: ['/user/login', '/user/signup', '/user/googleSignin'] })
  );

// Global Error Handling for JWT
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid or No Authorization Token Provided!');
  }
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`<----Server is running on port ${PORT} ---->`);
});

app.use('/user', require('./routes/userRoutes'));
app.use('/project', require('./routes/projectRoutes'));
