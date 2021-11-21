const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  id: {
    type: String,
  },
  source: {
    type: String,
  },
  year: {
    type: Number,
  },
  difficulty: {
    type: String,
  },
  tournament_level: {
    type: String,
  },
  round: {
    type: Number,
  },
  category: {
    type: String,
  },
  tossup_format: {
    type: String,
  },
  tossup_question: {
    type: String,
  },
  tossup_options: {
    type: Object,
  },
  tossup_answers: {
    type: Array,
  },
  bonus_format: {
    type: String,
  },
  bonus_question: {
    type: String,
  },
  bonus_options: {
    type: Object,
  },
  bonus_answers: {
    type: Array,
  },
});

module.exports = mongoose.model('Question', questionSchema);
