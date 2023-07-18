const colors = require('colors');

// Custom log format with timestamp
const logFormat = (req, res) => {
  const method = req.method;
  const url = req.originalUrl;
  const status = res.statusCode;
  const responseTime = `${res.get('X-Response-Time')}ms`;

  let logMessage = '';

  if (status >= 500) {
    logMessage += colors.red(`${status} - ${method} ${url} (${responseTime})`);
  } else if (status >= 400) {
    logMessage += colors.yellow(`${status} - ${method} ${url} (${responseTime})`);
  } else {
    logMessage += colors.green(`${status} - ${method} ${url} (${responseTime})`);
  }

  return logMessage;
};

// Logger middleware
const loggerMiddleware = (req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    res.set('X-Response-Time', durationInMilliseconds);
    console.log(logFormat(req, res));
  });
  next();
};

// Utility function to calculate response time in milliseconds
const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9; // nanoseconds per second
  const NS_TO_MS = 1e6; // nanoseconds to milliseconds
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

module.exports = loggerMiddleware;
