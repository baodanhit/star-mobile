const express = require('express');
const router = express.Router();
const menu = require('../database/menu.json');
const Product = require('../database/models/product');
const Order = require('../database/models/order');
const categories = ['Điện thoại', 'Laptop', 'Máy tính bảng', 'Phụ kiện']
let getProductLimited = async (category, limit) => {
  const projection = {
    preview: 0,
    detailInfo: 0
  };
  let products = await Product.find({ category: category }, projection).limit(limit);
  return products
}
router.get('/products-by-cate', async function (req, res, next) {
  let previewProducts = [];
  for (category of categories) {
    let products = await getProductLimited(category, 10);
    let dataObj = {};
    dataObj[category] = products
    previewProducts.push(dataObj);
  }
  res.json({ data: { menu, products: previewProducts } });
});
router.get('/product/:id', async function (req, res, next) {
  let id = req.params.id;
  let product = await Product.findOne({ _id: id });
  res.json({ product });
});
router.get('/search', async function (req, res, next) {
  let searchText = req.query.name;
  let regex = new RegExp(searchText, 'i');
  let products = await Product.find({ name: { $regex: regex } }, '_id name price images');
  res.json({ products });
});

router.get('/category/:category/:page', async (req, res, next) => {
  let page = req.params.page || 1;
  let limit = req.query.limit || 18;
  let priceStr = req.query.price;
  let brand = req.query.brand;
  let filters = {};
  if (brand) {
    filters.brand = brand
  }
  if (priceStr) {
    filters.price = priceStr.split('-');
  }
  let categoryStr = req.params.category;
  let category = '';
  switch (categoryStr) {
    case 'dien-thoai':
      category = 'Điện thoại';
      break;
    case 'laptop':
      category = 'Laptop';
      break;
    case 'may-tinh-bang':
      category = 'Máy tính bảng';
      break;
    case 'phu-kien':
      category = 'Phụ kiện';
      break;
  }
  let getProductPerPage = async (category) => {
    let products = []
    let filterObj = {
      category: category,
    }
    if (Object.keys(filters).length) {
      if (filters.brand) {
        let $nameRegex = new RegExp(filters.brand, 'i');
        filterObj.name = { $regex: $nameRegex };
      }
      if (filters.price) {
        filterObj['price.old'] = { $gte: parseInt(filters.price[0]), $lte: parseInt(filters.price[1]) }
      }
      products = await Product.find(filterObj)
      console.log(filterObj)
    }
    else {
      products = await Product.find({ category: category })
        .skip((limit * page) - limit)
        .limit(limit)
    }
    Product.countDocuments(filterObj, (err, count) => {
      if (err) return next(err);
      res.json({
        count,
        products,
        currentPage: page,
        totalPages: Math.ceil(count / limit)
      });
    });
  }
  getProductPerPage(category);
})
router.post('/order', async function (req, res, next) {
  let data = req.body;
  if (Object.keys(data).length != 0) {
    var newOrder = new Order(data);
    newOrder.save(function (err, re) {
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
  return res.status(406).end();

});
module.exports = router;
