import React, { useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthContext } from '../../contexts/auth';
import { SocketContext } from '../../contexts/socket';
import { StatsContext } from '../../contexts/stats';

import './RoundSummary.css';
import backgroundShapes from './backgroundShapes.png';
import useInterval from '../../hooks/useInterval';

const RoundSummary = () => {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const { roundQuestions, setRQuestion } = useContext(StatsContext);
  const [displaySummary, setDisplaySummary] = useState(false);
  const [roundEnd, setRoundEnd] = useState();
  const [roundStartCountdown, setRoundStartCountdown] = useState();
  const [countdownState, setCountdownState] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const roundStats = {
    total: roundQuestions.length,
    correct: roundQuestions.filter((obj) => obj.status === 'correct').length,
    incorrect: roundQuestions.filter((obj) => obj.status === 'incorrect').length,
    unattempted: roundQuestions.filter((obj) => obj.status === 'unattempted').length,
  };

  const calcPercentage = (num) => {
    return `${(num / roundStats.total) * 100}%`;
  };

  const questionStatusFormat = [
    {
      type: 'correct',
      color: 'var(--green)',
      icon: 'check',
    },
    {
      type: 'incorrect',
      color: 'var(--red)',
      icon: 'clear',
    },
    {
      type: 'unattempted',
      color: 'var(--secondary-gray)',
      icon: 'clear',
    },
  ];

  const dropIn = {
    hidden: {
      y: '-100vh',
      opacity: 1,
    },
    visible: {
      y: '50vh',
      opacity: 1,
      transition: {
        duration: 0.1,
        type: 'spring',
        damping: 25,
        stiffness: 280,
      },
    },
    exit: {
      y: '-100vh',
      opacity: 1,
    },
  };

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  useEffect(() => {
    socket.on('roundEnd', (roundEnd) => {
      console.log('Round Ended ⛳');
      setRoundEnd(roundEnd);
      setDisplaySummary(true);
      setCountdownState(true);
      open();
    });
    socket.on('roundStart', () => {
      console.log('Round Started 🏁');
      setDisplaySummary(false);
      setCountdownState(false);
      close();
    });
  }, []);

  useInterval(
    () => {
      let distance = (new Date(roundEnd.startTime).getTime() - new Date().getTime()) / 1000;
      distance = distance.toFixed(0);
      if (distance > 0) {
        distance < 10 ? setRoundStartCountdown(`0${distance}`) : setRoundStartCountdown(`${distance}`);
      } else {
        setRoundStartCountdown('00');
        setCountdownState(false);
      }
    },
    countdownState == true ? 100 : null
  );

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
          variants={dropIn}
          className="modal"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="roundSummary">
            <div className="roundSummary__header">
              <div className="roundSummary__header__left">
                <h2 className="roundSummary__header__left__greeting">Nice work, {user?.result?.username}!</h2>
                <h2 className="roundSummary__header__left__summary__text">Summary</h2>
                <div
                  className="roundSummary__header__left__summary__bar"
                  style={{
                    gridTemplateColumns: `${calcPercentage(roundStats.correct)} ${calcPercentage(
                      roundStats.incorrect
                    )} ${calcPercentage(roundStats.unattempted)}`,
                  }}
                >
                  <div
                    className="roundSummary__header__left__summary__bar__tooltip roundSummary__header__left__summary__bar__correct"
                    style={{
                      borderRadius: `${
                        roundStats.incorrect === 0 && roundStats.unattempted === 0
                          ? '50px 50px 50px 50px'
                          : '50px 0 0 50px'
                      }`,
                    }}
                  >
                    <h2
                      className="roundSummary__header__left__summary__bar__tooltiptext"
                      style={{ display: `${roundStats.correct === 0 ? 'none' : 'block'}` }}
                    >
                      {roundStats.correct}/{roundStats.total}
                    </h2>
                  </div>
                  <div
                    className="roundSummary__header__left__summary__bar__tooltip roundSummary__header__left__summary__bar__incorrect"
                    style={{
                      borderRadius: `${
                        roundStats.correct === 0 && roundStats.unattempted === 0
                          ? '50px 50px 50px 50px'
                          : roundStats.correct === 0
                          ? '50px 0 0 50px'
                          : roundStats.unattempted === 0
                          ? '0 50px 50px 0'
                          : '0 0 0 0'
                      }`,
                    }}
                  >
                    <h2
                      className="roundSummary__header__left__summary__bar__tooltiptext"
                      style={{ display: `${roundStats.incorrect === 0 ? 'none' : 'block'}` }}
                    >
                      {roundStats.incorrect}/{roundStats.total}
                    </h2>
                  </div>
                  <div
                    className="roundSummary__header__left__summary__bar__tooltip roundSummary__header__left__summary__bar__unattempted"
                    style={{
                      borderRadius: `${
                        roundStats.correct === 0 && roundStats.incorrect === 0 ? '50px 50px 50px 50px' : '0 50px 50px 0'
                      }`,
                    }}
                  >
                    <h2
                      className="roundSummary__header__left__summary__bar__tooltiptext"
                      style={{ display: `${roundStats.unattempted === 0 ? 'none' : 'block'}` }}
                    >
                      {roundStats.unattempted}/{roundStats.total}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="roundSummary__header__right">
                <div className="roundSummary__header__right__timer__wrapper">
                  <h3 className="roundSummary__header__right__timer__text">Next round starting in:</h3>
                  <h3 className="roundSummary__header__right__timer">0:{roundStartCountdown}</h3>
                </div>
                <img src={backgroundShapes} className="roundSummary__header__right__shapes" />
              </div>
            </div>
            <div className="roundSummary__body">
              <div className="roundSummary__categoryVote">
                <h3 className="roundSummary__sectionHeading">Vote for questions you want to see more next round</h3>
                <div className="roundSummary__categoryVote__options">
                  <div className="roundSummary__categoryVote__option no-select">
                    <h3 className="roundSummary__categoryVote__option__text">Math</h3>
                    <div className="roundSummary__categoryVote__option__votes__wrapper">
                      <h3 className="roundSummary__categoryVote__option__votes">4</h3>
                    </div>
                  </div>

                  <div className="roundSummary__categoryVote__option no-select">
                    <h3 className="roundSummary__categoryVote__option__text">Earth Science</h3>
                    <div className="roundSummary__categoryVote__option__votes__wrapper">
                      <h3 className="roundSummary__categoryVote__option__votes">2</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="roundSummary__questionsReview">
                <h3 className="roundSummary__sectionHeading">Questions in this round</h3>
                <div className="roundSummary__questionsReview__questions">
                  {roundQuestions.map((el) => (
                    <div className="roundSummary__questionsReview__question">
                      <h4 className="roundSummary__questionsReview__question__text">{el.question}</h4>
                      <h4 className="roundSummary__questionsReview__question__answer">
                        Answer: {el.answer} <br />
                        {el['user_answer'] !== null ? `Your Answer: ${el.user_answer}` : ''}
                      </h4>
                      <div className="roundSummary__questionsReview__question__toolbar">
                        <span
                          className="material-icons-outlined roundSummary__questionsReview__question__toolbar__validity"
                          style={{
                            color: `${questionStatusFormat
                              .filter((ele) => ele.type === el.status)
                              .map((ele) => ele.color)}`,
                          }}
                        >
                          {questionStatusFormat.filter((ele) => ele.type === el.status).map((ele) => ele.icon)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="roundSummary__closeSummary" onClick={() => close()} label="Close">
              <div className="roundSummary__closeSummary__text">Close Summary</div>
              <span className="material-icons-outlined roundSummary__closeSummary__btn">clear</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoundSummary;
