import React, { useState } from 'react';

import './ChatStream.css';

const ReadMore = ({ textToDisplay }) => {
  const [isReadQuestion, setIsReadQuestion] = useState(false);
  const questionAnswer = textToDisplay.split('&&&');

  const toggleReadMore = () => {
    setIsReadQuestion(!isReadQuestion);
  };

  return (
    <>
      Correct Answer: {questionAnswer[0]}&nbsp;&nbsp;
      {isReadQuestion && (
        <>
          <br />
          Question: {questionAnswer[1]}&nbsp;&nbsp;
        </>
      )}
      <span onClick={toggleReadMore} className="chat__message__main__content__read-question">
        {isReadQuestion ? (
          <>
            <span>hide question</span> <span className="material-icons-outlined" style={{lineHeight: "20px", fontSize: "20px", opacity: "0.8"}}>expand_less</span>
          </>
        ) : (
          <>
            <span>read question</span> <span className="material-icons-outlined" style={{lineHeight: "20px", fontSize: "20px", opacity: "0.8"}}>expand_more</span>
          </>
        )}
      </span>
    </>
  );
};

export default ReadMore;

{
  /* <span className="material-icons-outlined">expand_more</span> */
}
