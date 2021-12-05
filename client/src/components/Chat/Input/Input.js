import React, { useContext, useEffect, useRef, useState } from 'react';

import useKeypress from '../../../hooks/useKeypress';
import './Input.css';
import { AuthContext } from '../../../contexts/auth';

const Input = ({ setMessage, sendMessage, message, requestBuzz, buzz, question }) => {
  const { user } = useContext(AuthContext);
  const [checked, setChecked] = useState();
  const [inputMode, setInputMode] = useState('');
  const [isEnterReset, setIsEnterReset] = useState(true);
  const latestIsEnterReset = useRef(isEnterReset);
  const inputRef = useRef();

  let buzzRequested = false;
  let letterOptions = ['w', 'x', 'y', 'z'];

  useKeypress(
    ' ',
    () => {
      latestIsEnterReset.current = isEnterReset;
      let buzzDetect;

      buzzDetect = setTimeout(() => {
        if (
          inputMode === '' &&
          latestIsEnterReset.current &&
          buzzRequested === false &&
          Object.keys(buzz).length === 0
        ) {
          setInputMode('buzz');
          requestBuzz();
          buzzRequested = true;
          if (question.options == undefined || question.options == null) inputRef.current.focus();
          setIsEnterReset(false);
        }
      }, 0);

      return () => clearTimeout(buzzDetect);
    },
    [inputMode, isEnterReset, latestIsEnterReset]
  );

  useEffect(() => {
    buzzRequested = false;
    if (user.user == buzz.user) {
        
    }
  }, [buzz]);

  useKeypress(
    'Enter',
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

  useEffect(() => {
    setChecked();
  }, [checked]);

  // useEffect(() => {
  //   inputRef.current.focus();
  // }, [inputMode]);

  useEffect(() => {
    if (Object.keys(buzz).length === 0) {
      console.log(buzz);
      setInputMode('');
      setIsEnterReset(true);
      if (question.options == undefined || question.options == null) inputRef.current.blur();
      setMessage('');
    }
  }, [buzz]);

  return (
    <div className="chat-input">
      <input
        type="radio"
        id="chat"
        name="inputMode"
        value="chat"
        checked={checked || inputMode === 'chat'}
        onChange={() => {
          setInputMode('chat');
          setIsEnterReset(false);
        }}
        disabled={inputMode === 'buzz'}
      />
      <label htmlFor="chat" className="chat-input__button">
        <span className="material-icons-outlined chat-input__button__icon">chat</span>
        <h3 className="chat-input__button__label">Chat</h3>
      </label>

      <input
        type="radio"
        id="buzz"
        name="inputMode"
        value="buzz"
        checked={checked || inputMode === 'buzz'}
        onChange={() => {
          setInputMode('buzz');
          setIsEnterReset(false);
          requestBuzz();
        }}
        disabled={inputMode === 'chat' || user.user !== buzz.user ? true : false}
      />
      <label htmlFor="buzz" className="chat-input__button">
        <span className="material-icons-outlined chat-input__button__icon">lightbulb</span>
        <h3 className="chat-input__button__label">Buzz</h3>
      </label>

      {inputMode == 'buzz' && question.options !== undefined && question.options !== null ? (
        <div className="chat-input__options">
          {Object.keys(question.options).map((keyName, i) => (
            <div
              className="chat-input__option"
              key={i}
              onClick={() => {
                sendMessage(null, inputMode, letterOptions[i]);
                setInputMode('');
                setChecked(false);
                setIsEnterReset(true);
              }}
            >
              <div className="chat-input__option__letter">{keyName.toUpperCase()}</div>
              <div className="chat-input__option__text">{question.options[keyName]}</div>
            </div>
          ))}
        </div>
      ) : (
        <input
          className="chat-input__msg"
          placeholder="[ENTER] to Chat     [SPACE] to Buzz"
          type="text"
          ref={inputRef}
          value={message}
          onChange={({ target: { value } }) => setMessage(value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              //setMessage((message) => message.trim());
              sendMessage(event, inputMode);
              setInputMode('');
              setChecked(false);
              setIsEnterReset(true);
            }
          }}
          disabled={!inputMode}
        ></input>
      )}
    </div>
  );
};

export default Input;
