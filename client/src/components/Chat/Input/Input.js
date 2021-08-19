import React, { useEffect, useRef, useState } from 'react';

import useKeypress from '../../../hooks/useKeypress';
import './Input.css';

const Input = ({ setMessage, sendMessage, message }) => {
  const [checked, setChecked] = useState();
  const [inputMode, setInputMode] = useState('');
  const [isEnterReset, setIsEnterReset] = useState(true);
  const latestIsEnterReset = useRef(isEnterReset);

  const inputRef = useRef();

  useKeypress(
    ' ',
    () => {
      latestIsEnterReset.current = isEnterReset;
      setTimeout(() => {
        if (inputMode === '' && latestIsEnterReset.current) {
          setInputMode('chat');
          inputRef.current.focus();
          setIsEnterReset(false);
        }
      }, 0);
    },
    [inputMode, isEnterReset, latestIsEnterReset]
  );

  useKeypress(
    'Enter',
    () => {
      latestIsEnterReset.current = isEnterReset;
      setTimeout(() => {
        if (inputMode === '' && latestIsEnterReset.current) {
          setInputMode('buzz');
          inputRef.current.focus();
          setIsEnterReset(false);
        }
      }, 0);
    },
    [inputMode, isEnterReset, latestIsEnterReset]
  );

  useEffect(() => {
    setChecked();
  }, [checked]);

  useEffect(() => {
    inputRef.current.focus();
  }, [inputMode]);

  return (
    <div className="chat-input">
      <input
        type="radio"
        id="chat"
        name="inputMode"
        value="chat"
        checked={checked || inputMode === 'chat'}
        onClick={() => {
          setInputMode('chat');
          setIsEnterReset(false);
        }}
        disabled={inputMode === 'buzz'}
      />
      <label htmlFor="chat" className="chat-input__button">
        <span className="material-icons-outlined chat-input__button__icon">
          chat
        </span>
        <h3 className="chat-input__button__label">Chat</h3>
      </label>

      <input
        type="radio"
        id="buzz"
        name="inputMode"
        value="buzz"
        checked={checked || inputMode === 'buzz'}
        onClick={() => {
          setInputMode('buzz');
          setIsEnterReset(false);
        }}
        disabled={inputMode === 'chat'}
      />
      <label htmlFor="buzz" className="chat-input__button">
        <span className="material-icons-outlined chat-input__button__icon">
          radio_button_checked
        </span>
        <h3 className="chat-input__button__label">Buzz</h3>
      </label>

      <input
        className="chat-input__msg"
        placeholder="[SPACE] to Chat     [ENTER] to Buzz"
        type="text"
        ref={inputRef}
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            sendMessage(event, inputMode);
            setInputMode('');
            setChecked(false);
            setIsEnterReset(true);
          }
        }}
        disabled={!inputMode}
      ></input>
    </div>
  );
};

export default Input;
