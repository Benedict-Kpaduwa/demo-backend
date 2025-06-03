const express = require('express');
const http = require('http');
const authRoutes = require('./routes/auth.routes');
const transactionRoutes = require('./routes/transactions.routes');
const { setupWebSocket } = require('./services/websocket.service');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();

if (dotenv.error) {
    throw dotenv.error;
}

connectDB();
const app = express();
const server = http.createServer(app);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

connectRedis();

setupWebSocket(server);

app.use('/api/auth/', authRoutes);
app.use('/api', transactionRoutes);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server running on ws://localhost:${PORT}/transactions`);
});