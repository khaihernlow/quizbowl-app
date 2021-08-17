import React from 'react';

import './Input.css';

const Input = () => {
  return (
    <div className="chat-input">
      <div className="chat-input__button chat-input__buton--active">
        <span className="material-icons-outlined chat-input__button__icon">chat</span>
        <h3 className="chat-input__button__label chat-input__button__label--active">
          Chat
        </h3>
      </div>
      <div className="chat-input__button">
        <span className="material-icons-outlined chat-input__button__icon">radio_button_checked</span>
        <h3 className="chat-input__button__label">Buzz</h3>
      </div>
      <input
        className="chat-input__msg"
        placeholder="[SPACE] to Chat     [ENTER] to Buzz"
      ></input>
    </div>
  );
};

export default Input;
