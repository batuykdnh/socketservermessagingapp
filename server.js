const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Apply CORS to allow the front-end to communicate with the server
app.use(cors({
    origin: process.env["ORIGIN_URL"], // Frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
}));

// Basic route to verify server is running
app.get("/", (req, res) => {
    res.send(`Origin URL: ${process.env["ORIGIN_URL"]}`);
});

const httpServer = http.createServer(app);  // Pass Express app to HTTP server

const io = new Server(httpServer, {
    cors: {
        origin: process.env["ORIGIN_URL"], // Frontend URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        transports: ['websocket'], // WebSockets only
        credentials: true,
    },
});

io.on('connection', (socket) => {
    socket.on("getMessage", (data) => {
        io.emit("getMessage", data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {  // Listen on all interfaces
    console.log(`Socket.io server is running on port ${PORT}`);
});
