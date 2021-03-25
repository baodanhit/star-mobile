var express = require('express');
var router = express.Router();
var menu = require('../database/menu.json');

router.get('/data', function (req, res, next) {
  res.json({ data: { menu } });
});

module.exports = router;
