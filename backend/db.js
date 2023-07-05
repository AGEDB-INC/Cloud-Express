const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("<---Connected to MongoDB Database Successfully!--->");
  }).catch((err) => {
    console.log("Database Connection Failed: ", err.message);
  });

  module.exports = mongoose;