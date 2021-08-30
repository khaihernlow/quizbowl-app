let serverInstance = '';

module.exports = (io) => {
  const { addUser, removeUser, getUser } = require('./user');
  const { getQuestion } = require('./question');

  io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
      if (serverInstance === '') {
        serverInstance = socket.id;
      }

      const { error, user } = addUser({ id: socket.id, name, room });

      if (error) return callback(error);

      socket.join(user.room);

      socket.emit('message', {
        user: 'admin',
        text: `${user.name}, welcome to room ${user.room}.`,
        messageStatus: 'chat',
        timestamp: new Date(),
      });
      socket.broadcast.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} has joined!`,
        messageStatus: 'chat',
        timestamp: new Date(),
      });

      // async function runRun() {
      //   const { question } = getQuestion();
      //   io.to(user.room).emit('question', question);
      //   await new Promise((r) => setTimeout(r, 5000));
      //   console.log(`${user.name}: done!`);
      // }

      // if (serverInstance === socket.id) {
      //   runRun();
      // }

      let question, answer;

      async function testRun() {
        ({ question, answer } = getQuestion());
        console.log(question.text);
        console.log(answer);
        let timeDiff = new Date(question.unreadEndTime).getTime() - new Date();
        console.log(timeDiff);
        io.to(user.room).emit('question', question);
        await new Promise((r) => setTimeout(r, timeDiff));
        console.log('question done');
        await new Promise(r => setTimeout(r, 2000));
        testRun();  
      }

      if (serverInstance === socket.id) {
        testRun();
      }

      socket.on('sendMessage', (message, inputMode, callback) => {
        const user = getUser(socket.id);
        let messageStatus;

        if (inputMode === 'buzz') {
          if (message.toLowerCase() === answer?.toLowerCase()) {
            messageStatus = 'correct';
          } else {
            messageStatus = 'incorrect';
          }
        } else if (inputMode === 'chat') {
          messageStatus = 'chat';
        }

        io.to(user.room).emit('message', {
          user: user.name,
          text: message,
          messageStatus: messageStatus,
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
};
