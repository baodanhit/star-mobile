const mongoose = require('mongoose');
const dotenv = require('dotenv');
const env = require('@ltv/env');
dotenv.config();
const dbName = env('DB_NAME', 'star-mobile');
const dbString = env('DB_STRING', 'mongodb+srv://star-moble-21:4IrBISqlxJwXIL68@cluster0.wak6z.mongodb.net/');
module.exports = connect = () => mongoose.connect(dbString + dbName, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch(error => console.log(error));
