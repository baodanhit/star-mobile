const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});
userSchema.pre('save', function (next) {
    var user = this
    bcrypt.hash(user.password, 10, function (err, encrypted) {
        user.password = encrypted
        next()
    })
});

const User = mongoose.model('User', userSchema);

module.exports = User;
