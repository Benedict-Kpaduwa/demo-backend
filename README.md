# 📦 Real-Time Transactions Dashboard – Backend

This is the backend service for the Real-Time Transactions Dashboard. It is built with **Node.js**, **Express**, **MongoDB**, **Redis**, and **WebSocket** to support real-time data updates and JWT-based authentication.

---

## 🚀 Features

- JWT authentication for login
- REST API for mock transaction data
- MongoDB for storing transaction records
- Redis for caching
- WebSocket for real-time transaction updates

---

## 🔧 Requirements

- Node.js (v18+ recommended)
- Redis server
- MongoDB instance

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Benedict-Kpaduwa/demo-backend
cd demo-backend
```

## Install Dependencies

```bash
pnpm install
```

## Create .env file
### Create a .env file in the root directory and add the following environment variables:

```bash
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
PORT=8000
MONGODB=your_mongodb_connection_string
```

## Run the server

```bash
pnpm run start
```
