const mongoose = require('mongoose');
const dotenv = require('dotenv');
const env = require('@ltv/env');
dotenv.config();
const dbName = env('DB_NAME', 'star-mobile');

module.exports = connect = () => mongoose.connect('mongodb://localhost:27017/' + dbName, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch(error => console.log(error));
