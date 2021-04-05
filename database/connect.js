const mongoose = require('mongoose');
module.exports = connect = () => mongoose.connect('mongodb://localhost:27017/star-com-2', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch(error => console.log(error));
