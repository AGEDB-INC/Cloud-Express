const colors = require('colors');

// Helper function to get colored status based on status code
const getStatusColor = (statusCode) => {
  if (statusCode >= 500) {
    return String(statusCode).red; // Red color for server errors (5xx)
  } else if (statusCode >= 400) {
    return String(statusCode).yellow; // Yellow color for client errors (4xx)
  } else {
    return String(statusCode).green; // Green color for success (2xx) and other status codes
  }
};

// Helper function to get colored status message
const getStatusMessageColor = (statusMessage) => {
  if (statusMessage === 'OK') {
    return statusMessage.yellow;
  } else {
    return statusMessage.red;
  }
};

// Helper function to get formatted timestamp (YYYY-MM-DD)
const getFormattedTimestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

module.exports = {
  getStatusColor,
  getStatusMessageColor,
  getFormattedTimestamp,
};
