const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    category: String,
    name: String,
    sku: String,
    price: String,
    config: [],
    shortInfo: [],
    detailInfo: [],
    images: []
});
const Product = mongoose.model('Product', schema);

module.exports = Product;
