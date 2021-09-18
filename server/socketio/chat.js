let serverInstance = '';

module.exports = (io) => {
  const { addUser, removeUser, getUser } = require('./user');
  const { getQuestion, getAnswer } = require('./question');

  let questionEndTime = '';
  let buzzStartTime = '';
  let buzzInProgress = false;

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
        ({ question } = getQuestion());
        ({ answer } = getAnswer());
        console.log('❓: ' + question.text);
        console.log('💬: ' + answer);

        let timeDiff = new Date(question.unreadEndTime).getTime() - new Date();
        console.log('⌛: ' + timeDiff);
        io.to(user.room).emit('question', question);

        questionEndTime = new Date(question.unreadEndTime);

        // await new Promise((r) => setTimeout(r, timeDiff));

        await new Promise((res) => {
          setTimeout(function bar() {
            if (new Date() > new Date(questionEndTime)) {
              res();
            } else {
              setTimeout(bar, 1);
            }
          }, 1);
        });

        io.to(user.room).emit('message', {
          user: 'admin',
          text: `${answer.toLowerCase()}&&&${question.text}`,
          messageStatus: 'question',
          timestamp: new Date(),
        });

        console.log('Question done');
        console.log('--------------------');

        await new Promise((r) => setTimeout(r, 2000));
        testRun();
      }

      if (serverInstance === socket.id) {
        testRun();
      }

      let nulifyBuzz;

      socket.on('sendMessage', async (message, inputMode, callback) => {
        const user = getUser(socket.id);
        let messageStatus;

        ({ answer } = await getAnswer());

        console.log(answer);

        if (inputMode === 'buzz') {
          buzzInProgress = false;
          clearTimeout(nulifyBuzz);
          // io.to(user.room).emit('buzz', {});
          console.log('Message: ' + message);
          console.log(message.toLowerCase() === answer.toLowerCase());
          // console.log('answer: ' + answer);
          if (message.toLowerCase() === answer.toLowerCase()) {
            messageStatus = 'correct';
            questionEndTime = new Date();
          } else {
            messageStatus = 'incorrect';
            questionEndTime = questionEndTime - (8000 - (new Date().getTime() - buzzStartTime.getTime()));
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

      socket.on('requestBuzz', () => {
        const user = getUser(socket.id);
        questionEndTime = new Date(questionEndTime).getTime() + 8000;

        buzzInProgress = true;
        buzzStartTime = new Date();
        nulifyBuzz = setTimeout(() => {
          if (buzzInProgress) {
            io.to(user.room).emit('buzz', {});
          }
        }, 8000);

        io.to(user.room).emit('buzz', {
          buzzEndTime: new Date(new Date().getTime() + 8000),
        });
      });

      socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
          io.to(user.room).emit('message', {
            user: 'admin',
            text: `${user.name} has left.`,
            messageStatus: 'chat',
            timestamp: new Date(),
          });
        }
      });

      callback();
    });
  });
};
