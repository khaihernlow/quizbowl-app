import React, { useContext, useEffect, useRef, useState } from 'react';

import useKeypress from '../../../hooks/useKeypress';
import './Input.css';
import { AuthContext } from '../../../contexts/auth';

const Input = ({ setMessage, sendMessage, message, requestBuzz, buzz }) => {
  const { user } = useContext(AuthContext);
  const [checked, setChecked] = useState();
  const [inputMode, setInputMode] = useState('');
  const [isEnterReset, setIsEnterReset] = useState(true);
  const latestIsEnterReset = useRef(isEnterReset);
  const inputRef = useRef();

  let buzzRequested = false;

  useKeypress(
    ' ',
    () => {
      latestIsEnterReset.current = isEnterReset;
      let buzzDetect;

      buzzDetect = setTimeout(() => {
        if (inputMode === '' && latestIsEnterReset.current && buzzRequested === false && Object.keys(buzz).length === 0) {
          setInputMode('buzz');
          requestBuzz();
          buzzRequested = true;
          inputRef.current.focus();
          setIsEnterReset(false);
        }
      }, 0);

      return () => clearTimeout(buzzDetect);
    },
    [inputMode, isEnterReset, latestIsEnterReset]
  );

  useEffect(() => {
    buzzRequested = false;
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

  useEffect(() => {
    inputRef.current.focus();
  }, [inputMode]);

  useEffect(() => {
    if (Object.keys(buzz).length === 0) {
      console.log(buzz);
      setInputMode('');
      setIsEnterReset(true);
      inputRef.current.blur();
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
        onClick={() => {
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
        onClick={() => {
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
    </div>
  );
};

export default Input;
