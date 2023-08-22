
const mongoose = require('mongoose');

const ReturnItemSchema = new mongoose.Schema({
    productName: String,
    customerId: String,
    reason: String,
    date: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" }
});

module.exports = mongoose.model('ReturnItem', ReturnItemSchema);
