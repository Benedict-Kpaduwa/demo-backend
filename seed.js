const mongoose = require('mongoose');
const Transaction = require('./models/Transaction.model');

mongoose.connect(process.env.MONGODB);

const seedTransactions = async () => {
    await Transaction.deleteMany({});
    const transactions = [
        { description: 'Purchase', amount: 100, date: new Date(), userId: 'test-user-id' },
        { description: 'Refund', amount: -50, date: new Date(), userId: 'test-user-id' },
    ];
    await Transaction.insertMany(transactions);
    console.log('Transactions seeded');
    mongoose.disconnect();
};

seedTransactions();