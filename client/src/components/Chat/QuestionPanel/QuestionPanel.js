import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CircularProgress } from '@material-ui/core';

import './QuestionPanel.css';

const QuestionPanel = ({ question, user }) => {
  const [displayQuestion, setDisplayQuestion] = useState('');
  const [readTimeCountdown, setReadTimeCountdown] = useState('');
  const [initialReadEndTimeDiff, setInitialReadEndTimeDiff] = useState();
  const [unreadTimeCountdown, setUnreadTimeCountdown] = useState('5.0');
  const [showUnreadBar, setShowUnreadBar] = useState(false);
  const [preStart, setPreStart] = useState(true);
  const [connecting, setConnecting] = useState(true);
  const [siteBlur, setSiteBlur] = useState(false);

  const focusSite = () => {
    console.log('Site is in focus');
    if (siteBlur === true) {
      if (Object.keys(question).length !== 0) {
        let displayQuestionSnap = displayQuestion.trim().split(' ');
        let questionSnap = question.text
          .split(' ')
          .slice(0, displayQuestionSnap.length);
        displayQuestionSnap.length === questionSnap.length &&
        displayQuestionSnap.every(
          (value, index) => value === questionSnap[index]
        )
          ? setConnecting(false)
          : setConnecting(true);
      } else {
        setConnecting(true);
      }
      setSiteBlur(false);
    }
  };

  const blurSite = () => {
    console.log('Site is blurred');
    if (!preStart) setSiteBlur(true);
  };

  const SiteFocusHandler = () => {
    useEffect(() => {
      window.addEventListener('focus', focusSite);
      window.addEventListener('blur', blurSite);

      return () => {
        window.removeEventListener('focus', focusSite);
        window.removeEventListener('blur', blurSite);
      };
    });

    return <></>;
  };

  SiteFocusHandler();

  useEffect(() => {
    setDisplayQuestion('');
    setUnreadTimeCountdown('5.0');
    setShowUnreadBar(false);
    if (!preStart) setConnecting(false);

    if (Object.keys(question).length !== 0) {
      setInitialReadEndTimeDiff(
        (new Date(question.readEndTime).getTime() - new Date().getTime()) / 1000
      );

      const readEndTime = setInterval(() => {
        let distance =
          (new Date(question.readEndTime).getTime() - new Date().getTime()) /
          1000;
        distance = distance.toFixed(1);
        if (distance > 0) {
          setReadTimeCountdown(`${distance}`);
        } else {
          console.log(`Time Done! ${new Date().getTime()}`);
          setReadTimeCountdown('0.0');
          clearInterval(readEndTime);

          const unreadEndTime = setInterval(() => {
            setShowUnreadBar(true);
            distance =
              (new Date(question.unreadEndTime).getTime() -
                new Date().getTime()) /
              1000;
            distance = distance.toFixed(1);
            if (distance > 0) {
              setUnreadTimeCountdown(`${distance}`);
            } else {
              setUnreadTimeCountdown('0.0');
              clearInterval(unreadEndTime);
            }
          }, 1);
        }
      }, 1);

      let splitStr = question.text.split(' ');
      let count = 0;
      const questionReader = setInterval(() => {
        if (count < splitStr.length) {
          setDisplayQuestion((prevDisplayQuestion) =>
            setDisplayQuestion(`${prevDisplayQuestion} ${splitStr[count]}`)
          );
          count += 1;
        } else {
          console.log(`Question Done! ${new Date().getTime()}`);
          clearInterval(questionReader);
        }
      }, 80);
    }
  }, [question]);

  return (
    <div className="chat-question">
      {preStart ? (
        <div className="chat-question__prestart">
          <div className="chat-question__prestart__text">
            <h4 className="chat-question__prestart__text__greeting">
              Hello @{user?.result?.username}
            </h4>
            <h4 className="chat-question__prestart__text__room">
              Welcome to{' '}
              <span className="chat-question__prestart__text__room__tag">
                <span className="material-icons-outlined chat-question__prestart__text__room__tag__icon">
                  meeting_room
                </span>
                <h3 className="chat-question__prestart__text__room__tag__text">Science Bowl</h3>
              </span>{' '}
              room!
            </h4>
          </div>
          <div className="chat-quesiton__prestart__btn">
            <h3 className="chat-question__prestart__btn__guide">
              Read Guide
            </h3>
            <h2 className="chat-question__prestart__btn__start" onClick={() => setPreStart(false)}>Start</h2>
          </div>
        </div>
      ) : !connecting && !preStart ? (
        <>
          <div className="chat-question__bar">
            <div
              className="chat-question__bar__read__wrapper"
              style={{
                width: `${
                  (Number(initialReadEndTimeDiff) /
                    (Number(initialReadEndTimeDiff) + 5.0)) *
                  100
                }%`,
              }}
            >
              <motion.div
                className="chat-question__bar__read"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((initialReadEndTimeDiff - readTimeCountdown) /
                      initialReadEndTimeDiff) *
                    100
                  }%`,
                }}
              ></motion.div>
            </div>
            <div
              className="chat-question__bar__unread__wrapper"
              style={{ width: '100%' }}
            >
              {showUnreadBar && (
                <motion.div
                  className="chat-question__bar__unread"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((5.0 - unreadTimeCountdown) / 5.0) * 100}%`,
                  }}
                ></motion.div>
              )}
            </div>
          </div>
          <h4 className="chat-question__text">
            {/* For the following 3 processes, predict whether the change in enthalpy,
          or ∆Sº (read as: delta S naught), is positive or negative, respectively:
          1) decomposition of ammonium nitrate 2) sublimation of dry ice 3)
          condensation of gaseous iodine to liquid iodine */}
            {displayQuestion}
          </h4>
          <div className="chat-question__timer">
            <h3 className="chat-question__timer__read">{readTimeCountdown}s</h3>
            <h3 className="chat-question__timer__unread">
              {unreadTimeCountdown}s
            </h3>
            <h3></h3>
          </div>
        </>
      ) : (
        <div className="chat-question__conn">
          <CircularProgress
            className="chat-question__conn__loader"
            size="20px"
          />
          <h4 className="chat-question__conn__text">
            Connecting . . . <br />
            We are getting you into the game very soon!
          </h4>
        </div>
      )}
    </div>
  );
};

export default QuestionPanel;
