const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const router = express.Router();
var Product = require('../database/models/product');
var Order = require('../database/models/order');
var User = require('../database/models/user');
const session = require('express-session');

// upload storage setup
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/src/images/products')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage });
let images = [];

router.get('/login', function (req, res, next) {
  res.render('admin/login');
});
router.post('/login', function (req, res, next) {
  console.log(req.body);
  var { username, password } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err) console.log(err)
    console.log(user);
    if (!user) return res.redirect('/admin/login')
    bcrypt.compare(password, user.password, (err, same) => {
      console.log(same)
      if (!same) return res.redirect('/admin/login')
      req.session.userID = user._id;
      return res.redirect('/admin');
    })
  });
});
router.get('/', function (req, res, next) {
  if (!req.session.userID) return res.redirect('/admin/login');
  res.render('admin/index');
});
router.get('/logout', function (req, res, next) {
  req.session.userID = undefined;
  return res.redirect('/admin/login');
});
router.get('/*', function (req, res, next) {
  res.locals.userID = req.session.userID;
  next();
});
router.get('/products/:page', async function (req, res, next) {
  let page = req.params.page || 1;
  let limit = 20;
  Product
    .find({})
    .skip((limit * page) - limit)
    .limit(limit)
    .exec((err, products) => {
      Product.countDocuments({}, (err, count) => {
        if (err) return next(err);
        res.json({
          count,
          products,
          currentPage: page,
          totalPages: Math.ceil(count / limit)
        });
      });
    });
});
router.get('/product/:id', async function (req, res, next) {
  let id = req.params.id;
  let product = await Product.findOne({ _id: id });
  if (!product) return res.status(404).end();
  res.status(200).json({ product });
});
router.post('/product-images', upload.any(), async function (req, res, next) {
  if (!req.files) return res.status(406).end();
  images = req.files.map(file => file.originalname) || [];
  return res.status(200).end()
});
router.post('/product', upload.any(), async function (req, res, next) {
  let data = req.body;
  data.rating = 0;
  data.images = images;
  if (data.price.special == 0) data.price.special = data.price.old;
  if (Object.keys(data).length != 0) {
    var newProduct = new Product(data);
    newProduct.save(function (err, re) {
      if (err) {
        console.log(err);
        // return res.status(406);
      }
      // saved!
      let id = re._id;
      return res.status(200).json({ id: id }).end();
    });
    return
  }
  images.length = 0;
  return res.status(406).end();

});
router.put('/product/:id', async function (req, res, next) {
  let id = req.params.id;
  let data = req.body;
  if (images.length != 0) {
    data.images.push(...images);
  }
  if (data.price.special == 0) data.price.special = data.price.old;
  Product.findOneAndUpdate({ _id: id }, data, function (err, doc) {
    if (err) {
      console.log(err);
      return res.status(406).end();
    }
    return res.status(200).end();
  });
  images.length = 0;
});
router.delete('/product/:id', async function (req, res, next) {
  let id = req.params.id;
  const re = await Product.deleteOne({ _id: id });
  if (re.deletedCount == 0) {
    return res.status(406).end();
  }
  res.status(200).end();
});
router.get('/orders/:page', async function (req, res, next) {
  let page = req.params.page || 1;
  let limit = 20;
  Order
    .find({})
    .skip((limit * page) - limit)
    .limit(limit)
    .exec((err, orders) => {
      if (err) return console.log(err);
      Order.countDocuments({}, (err, count) => {
        if (err) return next(err);
        res.json({
          count,
          orders,
          currentPage: page,
          totalPages: Math.ceil(count / limit)
        });
      });
    });
});
router.get('/order/:id', async function (req, res, next) {
  let id = req.params.id;
  if (id) {
    let order = await Order.findOne({ _id: id });
    if (!order) return res.status(404).end();
    return res.status(200).json({ order });
  }
  res.status(404).end()
});
router.delete('/order/:id', async function (req, res, next) {
  let id = req.params.id;
  const re = await Order.deleteOne({ _id: id });
  if (re.deletedCount == 0) {
    return res.status(406).end();
  }
  res.status(200).end();
});
router.put('/order/:id', async function (req, res, next) {
  let id = req.params.id;
  let data = req.body;
  Order.findOneAndUpdate({ _id: id }, data, function (err, doc) {
    if (err) {
      console.log(err);
      return res.status(406).end();
    }
    return res.status(200).end();
  });
});
module.exports = router;
