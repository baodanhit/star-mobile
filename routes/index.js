var express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const env = require('@ltv/env');
const node_env = env('NODE_ENV', 'production');
var router = express.Router();

if (node_env == 'development') {
  const QRCode = require('qrcode');
  const network = require('../dev/network');
  let networkInfo = network();
  router.get('/qr', async (req, res) => {
    return res.render('QR');
  });
  router.get('/qr/data', async (req, res) => {
    let qr = await QRCode.toDataURL(`http://${networkInfo.ip}:3000`);
    return res.json({ qr, wifiname: networkInfo.wifiname });
  });
}
/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index');
});

module.exports = router;
