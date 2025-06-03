const { Router } = require('express');
const { getTransactionsHandler, getSummary } = require('../controllers/transactions.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = Router();

router.get('/transactions', authenticateToken, getTransactionsHandler);
router.get('/summary', authenticateToken, getSummary);

module.exports = router