const { createClient } = require('redis');

let redisClient;

const connectRedis = async () => {
    redisClient = createClient({
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        },
        password: process.env.REDIS_PASSWORD
    });

    redisClient.on('error', (err) => console.error('Redis error:', err));

    try {
        await redisClient.connect();
        console.log('✅ Connected to Redis Cloud');
    } catch (err) {
        console.error('❌ Failed to connect to Redis:', err);
    }

    return redisClient;
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
