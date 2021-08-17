import React from 'react';

import './QuestionPanel.css';

const QuestionPanel = () => {
  return (
    <div className="chat-question">
      <div className="chat-question__bar">
        <div className="chat-question__bar__read"></div>
        <div className="chat-question__bar__unread"></div>
      </div>
      <h4 className="chat-question__text">
        For the following 3 processes, predict whether the change in enthalpy,
        or ∆Sº (read as: delta S naught), is positive or negative, respectively:
        1) decomposition of ammonium nitrate 2) sublimation of dry ice 3)
        condensation of gaseous iodine to liquid iodine
      </h4>
      <div className="chat-question__timer">
        <h3 className="chat-question__timer__read">0:00</h3>
        <h3 className="chat-question__timer__unread">0:04</h3>
      </div>
    </div>
  );
};

export default QuestionPanel;
