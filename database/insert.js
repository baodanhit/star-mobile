var dbConnect = require('./connect');
var User = require('./models/user');
dbConnect();
var user = new User({
    username: 'danhdz',
    password: '3001190528'
})
user.save((err) => {
    console.log(err)
})