var dbConnect = require('./connect');
var User = require('./models/user');
dbConnect();
var user = new User({
    username: 'danhdz',
    password: 'danhdz'
})
user.save((err) => {
    console.log(err)
})