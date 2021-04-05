const express = require('express');
const router = express.Router();
const menu = require('../database/menu.json');
const Product = require('../database/models/product');
const categories = ['Điện thoại', 'PC để bàn', 'Laptop', 'Máy tính bảng', 'Phụ kiện']
let getProductLimited = async (category, limit) => {
  const projection = {
    shortInfo: 0,
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

module.exports = router;
