const { getRedisClient } = require('../config/redis');
const Transaction = require('../models/Transaction.model');
const { getTransactions } = require('../services/transaction.service.js');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const verifyToken = (req) => {
    const token = req.cookies.token;
    if (!token) throw new Error('Unauthorized');
    return jwt.verify(token, process.env.JWT_SECRET);
};

const getTransactionsHandler = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        const redisClient = getRedisClient();
        const cacheKey = `transactions:${decoded.id}`;

        const cached = await redisClient.get(cacheKey);
        if (cached) return res.json({ transactions: JSON.parse(cached) });

        const transactions = await getTransactions(decoded.id);
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(transactions));
        res.json({ transactions });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(error.message === 'Unauthorized' ? 401 : 500).json({
            message: error.message || 'Failed to fetch transactions',
        });
    }
};

const getSummary = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        const redisClient = getRedisClient();
        const cacheKey = `summary:${decoded.id}`;

        const cached = await redisClient.get(cacheKey);
        if (cached) return res.json(JSON.parse(cached));

        const totalBalance = await Transaction.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(decoded.id) } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const summary = {
            totalBalance: totalBalance[0]?.total || 0,
            totalUsers: 1
        };

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(summary));
        res.json(summary);
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(error.message === 'Unauthorized' ? 401 : 500).json({
            message: error.message || 'Failed to fetch summary',
        });
    }
};

module.exports = { getTransactionsHandler, getSummary };