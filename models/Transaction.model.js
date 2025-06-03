const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    description: { type: String, default: 'Transaction' },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    userId: { type: String, required: true },
});

module.exports = mongoose.model('Transaction', transactionSchema);