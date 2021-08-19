const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
dotenv.config();

const { addUser, removeUser, getUser } = require('./socketio/user');

const userRoutes = require('./routes/user.js');
const roomRoutes = require('./routes/room.js');

const app = express();
const server = http.createServer(app);
corsOptions = {
  cors: true,
  origins: ['http://localhost:3000', 'https://kh-socketio-chat.netlify.app//'],
};
const io = socketio(server, corsOptions);

app.use(cors());

app.use(express.json());

app.use('/user', userRoutes);
app.use('/room', roomRoutes);

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to room ${room}.`,
      inputMode: 'chat',
      timestamp: new Date(),
    });
    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} has joined!`,
      inputMode: 'chat',
      timestamp: new Date(),
    });

    socket.on('sendMessage', (message, inputMode, callback) => {
      const user = getUser(socket.id);

      io.to(user.room).emit('message', {
        user: user.name,
        text: message,
        inputMode: inputMode,
        timestamp: new Date(),
      });

      callback();
    });

    socket.on('disconnect', () => {
      const user = removeUser(socket.id);
      if (user) {
        io.to(user.room).emit('message', {
          user: 'admin',
          text: `${user.name} has left.`,
          inputMode: 'chat',
          timestamp: new Date(),
        });
      }
    });

    callback();
  });
});

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to MongoDB');
  }
);

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Server has started on port: ${port}.`));
