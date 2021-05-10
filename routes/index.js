var express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const env = require('@ltv/env');
const node_env = env('NODE_ENV', 'production');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index');
});

module.exports = router;
