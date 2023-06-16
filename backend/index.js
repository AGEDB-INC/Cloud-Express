const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


// const mysql = require('mysql2');
const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./models');


const PORT = 3001;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
});