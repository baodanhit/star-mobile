const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    date: Date,
    total: Number,
    amount: Number,
    customer: Object,
    products: Object,
    status: String,
});
const Order = mongoose.model('Order', schema);

module.exports = Order;
