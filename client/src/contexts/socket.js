import React, { createContext, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './auth';

// const ENDPOINT = 'http://localhost:8000/'; //localhost
const ENDPOINT = 'https://quizbowl.onrender.com'; //render.com

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const getSocket = () => {
    const token = user?.token;
    if (token) {
      return io(ENDPOINT, {
        query: { token },
      });
    }
    return io(ENDPOINT);
  };

  const socket = getSocket();

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
