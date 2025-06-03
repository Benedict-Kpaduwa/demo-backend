const Transaction = require('../models/Transaction.model');

const getTransactions = async () => {
    const count = await Transaction.countDocuments();
    if (count === 0) {
        await Transaction.insertMany([
            { amount: 100, userId: 'user1' },
            { amount: 200, userId: 'user2' },
            { amount: 150, userId: 'user1' },
        ]);
    }
    return Transaction.find();
};

module.exports = { getTransactions }