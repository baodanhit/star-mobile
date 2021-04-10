const express = require('express');
const router = express.Router();
const menu = require('../database/menu.json');
const Product = require('../database/models/product');
const categories = ['Điện thoại', 'Laptop', 'Máy tính bảng', 'Phụ kiện']
let getProductLimited = async (category, limit) => {
  const projection = {
    preview: 0,
    detailInfo: 0
  };
  let products = await Product.find({ category: category }, projection).limit(limit);
  return products
}
router.get('/data', async function (req, res, next) {
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
router.get('/category/:category/:page', (req, res, next) => {
  let perPage = 18;
  let page = req.params.page || 1;
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
  let getProductPerPage = (category) => {
    Product
      .find({ category: category })
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec((err, products) => {
        Product.countDocuments({ category: category }, (err, count) => {
          if (err) return next(err);
          res.json({
            count,
            products,
            currentPage: page,
            totalPages: Math.ceil(count / perPage)
          });
        });
      });
  }
  getProductPerPage(category);
})
module.exports = router;
