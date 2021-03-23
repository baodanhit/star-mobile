var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var engine = require('./engine');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set template engine and views path
app.engine('html', engine);
app.set('views', './public/views') // specify the views directory
app.set('view engine', 'html') // register the template engine

// routers
app.use('/', indexRouter);

// not found
app.use((req, res) => {
    res.render("404");
});

module.exports = app;
