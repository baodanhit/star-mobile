const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    category: String,
    name: String,
    price: Object,
    type: String,
    rating: Number,
    detailInfo: Object,
    colors: Object,
    images: [],
    preview: String
});
const Product = mongoose.model('Product', schema);

module.exports = Product;
