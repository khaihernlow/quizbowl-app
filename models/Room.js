const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  roomID: {
    type: String,
  },
  name: {
    type: String,
  },
  icon: {
    type: String,
  },
  announcement: {
    type: String,
  },
  roundScores: {
    type: Array,
    default: [],
  },
  allTimeScores: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('Room', roomSchema);
