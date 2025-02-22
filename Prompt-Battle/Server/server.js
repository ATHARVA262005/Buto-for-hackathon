require('dotenv').config();

// Verify environment variables
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

const express = require('express');
const http = require('http');
const cors = require('cors');
const { connectDB } = require('./db/database.config');
const setupWebSocket = require('./websocket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// Setup WebSocket
const wss = setupWebSocket(server);
app.locals.wss = wss;

// Middleware
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Future Aptos wallet authentication will be implemented here

// Routes
app.use('/api', require('./routes/test.route'));
app.use('/api/prompts', require('./routes/prompt.route'));

// DB Connection
connectDB();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

