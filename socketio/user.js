const cron = require('node-cron');

const User = require('../models/User.js');
let users = [];
let rankedUsers = [];

const getAllConnectedUsers = () => {
  return users;
};

const getAllRankedUsers = (callback) => {
  User.find({ 'stats.sciencebowl.points': { $gte: 0 } }, 'username stats.sciencebowl.points -_id', (err, docs) => {
    if (err) console.log(err);
    docs.sort((a, b) => b.stats.sciencebowl.points - a.stats.sciencebowl.points);
    console.log('docs' + docs);
    rankedUsers = docs;
    callback(rankedUsers);
  });
};

cron.schedule('*/1 * * * *', () => {
  console.log('Saving players stats...');
  users.forEach((user) => {
    if (user.saved === false) {
      User.findOne({ username: user.username }, '-password -__v', async (err, doc) => {
        if (err) return console.log(err);
        doc.stats = user.stats;
        await doc.save();
      });
    }
  });
  console.log('Players stats saved.');
});

const addUser = ({ socketId, username, room }, callback) => {
  console.log(username);
  const existingUserLocal = users.find((user) => user.room === room && user.username === username);
  //const existingUserLocal = await User.findOne({ username });
  if (existingUserLocal) {
    console.log('Found a copy');
    existingUserLocal.socketId.push(socketId);
    console.log(existingUserLocal);
    getAllRankedUsers((usersStats) => {
      callback(existingUserLocal.stats, usersStats);
    });
    const user = existingUserLocal;
    return { user };
  }

  const existingUserDB = User.findOne({ username }, '-password -_id -__v', (err, doc) => {
    if (err) return console.log(err);
    const index = users.findIndex((user) => user.username === doc.username);
    if (index !== -1) users.splice(index, 1, { ...users[parseInt(index)], ...doc['_doc'] });
    console.log(users);
    getAllRankedUsers((usersStats) => {
      callback(doc.stats, usersStats);
    });
  });

  const user = { socketId: [socketId], username, room, saved: true };
  users.push(user);
  console.log(users);
  return { user };
};

const removeUser = async (socketId, username) => {
  const index = users.findIndex((user) => user.username === username);
  users[index].socketId = users[index].socketId.filter((el) => el !== socketId);
  console.log(users);

  return;
};

const addPoints = (user, typeOfQuestion) => {
  const indexUsers = users.findIndex((u) => u.username === user.username);
  users[parseInt(indexUsers)].stats.sciencebowl.points += 4;
  users[parseInt(indexUsers)].saved = false;

  const indexRankedUsers = rankedUsers.findIndex((rankedUser) => rankedUser.username === user.username);
  console.log('here' + rankedUsers);
  rankedUsers[indexRankedUsers].stats.sciencebowl.points += 4;
  rankedUsers.sort((a, b) => b.stats.sciencebowl.points - a.stats.sciencebowl.points);

  return { userStats: users[parseInt(indexUsers)].stats, allUsersStats: rankedUsers };
};

const getUser = (socketId) => users.find((user) => user.socketId === socketId);

module.exports = { getAllConnectedUsers, addUser, removeUser, getUser, addPoints };
