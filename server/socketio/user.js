const User = require('../models/User.js');
const users = [];

const addUser = ({ socketId, username, room }, callback) => {
  const existingUserLocal = users.find((user) => user.room === room && user.username === username);
  //const existingUserLocal = await User.findOne({ username });
  if (existingUserLocal) {
    return { error: 'Username is taken' };
  }

  const existingUserDB = User.findOne({ username }, '-password -_id -__v', (err, doc) => {
    if (err) return console.log(err);
    const index = users.findIndex((user) => user.username === doc.username);
    if (index !== -1) users.splice(index, 1, { ...users[parseInt(index)], ...doc['_doc'] });
    console.log(users);
    callback(doc.stats);
  });

  const user = { socketId, username, room };
  users.push(user);
  console.log(users);
  return { user };
};

const removeUser = async (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);

  if (index !== -1) {
    await User.findOne({ username: users[parseInt(index)].username }, '-password', async (err, doc) => {
      if (err) return console.log(err);
      console.log('heere');
      console.log(users[parseInt(index)]);
      doc.stats = users[parseInt(index)]?.stats;
      await doc.save();
    });
    return users.splice(index, 1)[0];
  }
  console.log(users);
};

const addPoints = (user, typeOfQuestion) => {
  const index = users.findIndex((u) => u.socketId === user.socketId);
  users[parseInt(index)].stats.sciencebowl.points += 4;
  return users[parseInt(index)].stats;
};

const getUser = (socketId) => users.find((user) => user.socketId === socketId);

module.exports = { addUser, removeUser, getUser, addPoints };
