var dbConnect = require('./connect');
var User = require('./models/user');
dbConnect();
var user = new User({
    username: 'admin',
    password: '12345'
})
user.save((err) => {
    console.log(err)
})