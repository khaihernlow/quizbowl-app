const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');

dotenv.config();

// Import Files
const userRoutes = require('./routes/user.js');
const roomRoutes = require('./routes/room.js');

// Requires the Express Module
const app = express();

// Initiate SocketIO
const server = http.createServer(app);
corsOptions = {
  cors: true,
  origins: ['http://localhost:3000', 'https://kh-quizbowl.netlify.app//'],
};
const io = socketio(server, corsOptions);
require('./socketio/chat')(io);

app.use(cors());

app.use(express.json());

app.use('/user', userRoutes);
app.use('/room', roomRoutes);

// Connect to MongoDB Database
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => {
    console.log('Connected to MongoDB');
  }
);

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Server has started on port: ${port}.`));
