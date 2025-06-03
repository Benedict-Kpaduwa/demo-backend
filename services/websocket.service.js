const { WebSocketServer } = require('ws');
const Transaction = require('../models/Transaction.model');
const jwt = require('jsonwebtoken');
const { getRedisClient } = require('../config/redis');

const setupWebSocket = (server) => {
    const wss = new WebSocketServer({ server, path: '/transactions' });

    wss.on('connection', (ws, req) => {
        console.log('A client connected');

        const token = new URL(req.url, 'http://localhost').searchParams.get('token');
        let userId = 'test-user-id';
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (error) {
                ws.close(1008, 'Unauthorized');
                return;
            }
        }

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message.toString());
                if (data.type === 'new_transaction') {
                    const transaction = new Transaction({
                        description: data.transaction.description || 'Manual Transaction',
                        amount: data.transaction.amount,
                        date: new Date(),
                        userId,
                    });
                    await transaction.save();
                    const redisClient = getRedisClient();
                    if (redisClient) {
                        await redisClient.del(`transactions:${userId}`);
                        await redisClient.del(`summary:${userId}`);
                    }
                    const transactionData = transaction.toObject();
                    ws.send(JSON.stringify(transactionData));
                    wss.clients.forEach((client) => {
                        if (client !== ws && client.readyState === client.OPEN) {
                            client.send(JSON.stringify(transactionData));
                        }
                    });
                }
            } catch (err) {
                ws.send(JSON.stringify({ error: 'Invalid message' }));
            }
        });

        ws.on('close', () => console.log('A client disconnected'));
    });

    setInterval(async () => {
        const mockTransaction = {
            description: 'Mock Purchase',
            amount: Math.floor(Math.random() * 1000),
            date: new Date(),
            userId: `user${Math.floor(Math.random() * 10)}`,
        };
        const transaction = new Transaction(mockTransaction);
        await transaction.save();
        const redisClient = getRedisClient();
        if (redisClient) {
            await redisClient.del(`transactions:${mockTransaction.userId}`);
            await redisClient.del(`summary:${mockTransaction.userId}`);
        }
        const transactionData = transaction.toObject();
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(transactionData));
            }
        });
    }, 5000);
};

module.exports = { setupWebSocket };