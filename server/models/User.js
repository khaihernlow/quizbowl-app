const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  id: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  stats: {
    level: {
      type: Number
    },
    coins: {
      type: Number
    },
    sciencebowl: {
      points: {
        type: Number,
      }
    }
  }
});

module.exports = mongoose.model('User', userSchema);
