var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
var dbConnect = require('./database/connect');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');
const dotenv = require('dotenv');
const env = require('@ltv/env');
var app = express();

dotenv.config();
const node_env = env('NODE_ENV', 'production');

console.clear();
if (node_env == 'development') {
    // live reload
    const livereload = require("livereload");
    const connectLivereload = require("connect-livereload");
    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch(path.join(__dirname, 'public'));
    app.use(connectLivereload());
    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 100);
    });
    // network info
    const QRCode = require('qrcode');
    var network = require('./dev/network');
    let wifiname = network().wifiname;
    let ip = network().ip;
    let addressLog = `||    Server is listening at: http://${ip}:3000 || http://localhost:3000  ||`
    console.log('='.repeat(addressLog.length));
    console.log(addressLog);
    let wifiLog = `||    Network: ${wifiname}`;
    console.log(wifiLog.padEnd(addressLog.length - 3), '||');
    console.log('='.repeat(addressLog.length), '\n');
    QRCode.toString(`http://${ip}:3000`, { type: 'terminal' }, function (err, url) {
        console.log(url)
    })
}

var engine = require('./engine');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const dbName = env('DB_NAME', 'star-mobile');
const dbString = env('DB_STRING', 'mongodb+srv://star-moble-21:4IrBISqlxJwXIL68@cluster0.wak6z.mongodb.net/');
app.use(session({ secret: 'secret', store: MongoStore.create({ mongoUrl: dbString + dbName }) }));

app.use(express.static(path.join(__dirname, 'public')));

// set template engine and views path
app.engine('html', engine);
app.set('views', './public/views') // specify the views directory
app.set('view engine', 'html') // register the template engine

// routers
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/admin', adminRouter);

// not found
app.use((req, res) => {
    res.render("404");
});
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

// connet to database
dbConnect();

module.exports = app;
