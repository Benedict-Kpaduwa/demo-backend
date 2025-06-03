const { createClient } = require('redis');

let redisClient;

const connectRedis = async () => {
    redisClient = createClient({
        socket: {
            host: 'redis-18397.c341.af-south-1-1.ec2.redns.redis-cloud.com',
            port: 18397
        },
        password: '07Xo9ZO5k6wi21pXXsOMvPG7WlsUtTPO'
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
