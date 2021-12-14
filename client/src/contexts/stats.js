import { createContext, useContext, useState } from 'react';
import { SocketContext } from './socket';

export const StatsContext = createContext();

export const StatsContextProvider = ({ children }) => {
  const socket = useContext(SocketContext);
  const [roundQuestions, setRoundQuestions] = useState([]);

  socket.on('roundStart', () => {
    setRoundQuestions([]);
  });

  function addQuestion(question) {
    setRoundQuestions((roundQuestions) => [...roundQuestions, question]);
  }

  return (
    <StatsContext.Provider
      value={{
        roundQuestions,
        setRQuestion: (object) => addQuestion(object),
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};
