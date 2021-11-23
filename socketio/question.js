let counter = 0;
let tossup_question = '';
const Question = require('../models/Question.js');

// const questions = [
//   {
//     category: 'PHYSICS',
//     tossup_answer: 'Kilogram (kg)',
//     tossup_format: 'Short Answer',
//     tossup_question: 'What is the metric unit for mass?',
//   },
//   {
//     category: 'BIOLOGY',
//     tossup_answer: 'PHENOTYPE',
//     tossup_format: 'Short Answer',
//     tossup_question:
//       'What is the most common term used in genetics to describe the observable physical characteristics of an organism caused by the expression of a gene or set of genes?',
//   },
//   {
//     category: 'CHEMISTRY',
//     tossup_answer: 'W) BASIC',
//     tossup_format: 'Multiple Choice',
//     tossup_question:
//       'An aqueous solution in which the concentration of OH- ions is greater than that of H+ ions is:\nW) basic\nX) acidic\nY) neutral\nZ) in equilibrium',
//   },
//   {
//     category: 'PHYSICS',
//     tossup_answer: 'AMPLITUDE',
//     tossup_format: 'Short Answer',
//     tossup_question: 'What property of a sound wave is most commonly associated with loudness?',
//   },
//   {
//     category: 'MATH',
//     tossup_answer: 'COMPLEMENTARY',
//     tossup_format: 'Short Answer',
//     tossup_question: 'What term BEST describes 2 angles with 90\u00b0 as the sum of their measurements?',
//   },
// ];

let questions;
// Question.find()
//   .sort({ $natural: 1 })
//   .limit(10)
//   .exec((err, data) => {
//     questions = data;
//     console.log(questions);
//   });

const fetchQuestionsFromDB = async () => {
  questions = await Question.find().sort({ $natural: 1 }).limit(10);
};

const getQuestion = async () => {
  if (questions == null) {
    await fetchQuestionsFromDB();
  }
  let now = new Date();

  // const questions = [
  //   'What is the metric unit for mass?',
  //   'What is the most common term used in genetics to describe the observable physical characteristics of an organism caused by the expression of a gene or set of genes?',
  //   'An aqueous solution in which the concentration of OH- ions is greater than that of H+ ions is:\nW) basic\nX) acidic\nY) neutral\nZ) in equilibrium',
  //   'What property of a sound wave is most commonly associated with loudness?',
  //   'What term BEST describes 2 angles with 90\u00b0 as the sum of their measurements?',
  // ];

  // const tossup_question = 'The overall charge at the top and bottom, respectively, of a towering cumulonimbus cloud during a thunderstorm is:\nW) positive, positive\nX) positive, negative\nY) negative, positive\nZ) negative, negative';
  if (counter === questions.length - 1) {
    counter = 0;
  } else {
    counter += 1;
  }
  tossup_question = questions[counter].tossup_question;
  category = questions[counter].category;

  const readEndTime = new Date(now.getTime() + 80 * tossup_question.split(' ').length);
  const unreadEndTime = new Date(readEndTime.getTime() + 5000);

  const question = {
    text: tossup_question,
    readEndTime: readEndTime,
    unreadEndTime: unreadEndTime,
    category: category,
    options: questions[counter].tossup_options,
    format: questions[counter].tossup_format,
  };

  return { question };
};

const getAnswer = () => {
  let formattedAnswers = questions[counter].tossup_answers;

  if (questions[counter].tossup_format == 'Multiple Choice') {
    console.log(questions[counter].tossup_answers);
    let letter = Object.keys(formattedAnswers[0])[0];
    formattedAnswers = `${letter.toUpperCase()} - ${formattedAnswers[0][letter]}`;
  } else if (questions[counter].tossup_format == 'Short Answer') {
    formattedAnswers = formattedAnswers.join(', ');
  }
  return { formattedAnswers };
};

const getRawAnswer = () => {
  let answers = questions[counter].tossup_answers;
  let format = questions[counter].tossup_format;
  return { answers, format };
};

module.exports = { getQuestion, getAnswer, getRawAnswer };
