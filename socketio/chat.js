const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
let serverInstance = '';

module.exports = (io) => {
  const { addUser, removeUser, getUser, addPoints } = require('./user');
  const { getQuestion, getAnswer, getRawAnswer } = require('./question');

  let questionEndTime = '';
  let buzzStartTime = '';
  let buzzInProgress = false;

  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        console.log('Socket Authorization Successful');
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  }).on('connect', (socket) => {
    socket.on('join', ({ room }, callback) => {
      socket.on('ping', () => {
        socket.emit('pong');
      });

      let username;
      const decodedToken = jwt_decode(socket.handshake.query.token);
      username = decodedToken.username;

      const { error, user } = addUser({ socketId: socket.id, username, room }, (userStats, allUsersStats) => {
        if (userStats && allUsersStats) {
          socket.emit('userStats', {
            userStats,
          });
          io.to(user.room).emit('allUsersStats', {
            allUsersStats,
          });
        }
      });
      if (error) return callback(error);

      if (serverInstance === '') {
        serverInstance = socket.id;
      }

      socket.join(user.room);

      socket.emit('message', {
        user: 'admin',
        text: `${user.username}, welcome to room ${user.room}.`,
        messageStatus: 'chat',
        timestamp: new Date(),
      });
      socket.broadcast.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.username} has joined!`,
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

      async function hostQuestion() {
        ({ question } = await getQuestion());
        ({ formattedAnswers } = getAnswer());

        let timeDiff = new Date(question.unreadEndTime).getTime() - new Date();
        io.to(user.room).emit('question', question);

        questionEndTime = new Date(question.unreadEndTime);

        // await new Promise((r) => setTimeout(r, timeDiff));
        await new Promise((res) => {
          setTimeout(function bar() {
            if (new Date() > new Date(new Date(questionEndTime) + 1000)) {
              res();
            } else {
              setTimeout(bar, 1);
            }
          }, 1);
        });

        io.to(user.room).emit('message', {
          user: 'admin',
          text: `${formattedAnswers}&&&${question.text}`,
          messageStatus: 'question',
          timestamp: new Date(),
        });

        await new Promise((r) => setTimeout(r, 2000));
        hostQuestion();
      }

      if (serverInstance === socket.id) {
        hostQuestion();
      }

      let nulifyBuzz;
      socket.on('sendMessage', async (message, inputMode, callback) => {
        let messageStatus;
        ({ answers, format } = await getRawAnswer());

        console.log(answers);

        if (inputMode === 'buzz') {
          buzzInProgress = false;
          clearTimeout(nulifyBuzz);
          // io.to(user.room).emit('buzz', {});
          //console.log('Message: ' + message);
          //console.log(message.toLowerCase() === answer.toLowerCase());
          // console.log('answer: ' + answer);
          let messageSample;
          if (format == 'Short Answer') {
            messageSample = message.toString().toUpperCase();
          } else if (format == 'Multiple Choice') {
            messageSample = message.toString().toLowerCase();
          }
          if (
            (format == 'Short Answer' && answers.includes(messageSample)) ||
            (format == 'Multiple Choice' && messageSample == Object.keys(answers[0])[0])
          ) {
            messageStatus = 'correct';
            questionEndTime = new Date();
            let { userStats, allUsersStats } = addPoints(user, 'tossup');
            socket.emit('userStats', {
              userStats,
            });
            io.to(user.room).emit('allUsersStats', {
              allUsersStats,
            });
          } else {
            messageStatus = 'incorrect';
            questionEndTime = questionEndTime - (8000 - (new Date().getTime() - buzzStartTime.getTime()));
          }
        } else if (inputMode === 'chat') {
          messageStatus = 'chat';
        }

        io.to(user.room).emit('message', {
          user: user.username,
          text: message,
          messageStatus: messageStatus,
          timestamp: new Date(),
        });

        callback();
      });

      socket.on('requestBuzz', () => {
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
          user: user.username,
        });
      });

      socket.on('disconnect', () => {
        removeUser(socket.id, user.username);
        io.to(user.room).emit('message', {
          user: 'admin',
          text: `${user.username} has left.`,
          messageStatus: 'chat',
          timestamp: new Date(),
        });
      });

      callback();
    });
  });
};
