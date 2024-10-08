import React, { useState, useEffect } from 'react';
import Chat from '../../components/Chat/Chat';
import Miscbar from '../../components/Miscbar/Miscbar';
import Navbar from '../../components/Navbar/Navbar';
import Rooms from '../../components/LeftBar/LeftBar';
import RoundSummary from '../../components/RoundSummary/RoundSummary';
import { useParams } from 'react-router';

import './Game.css';
import * as api from '../../api/index.js';
import { StatsContextProvider } from '../../contexts/stats';

const Game = () => {
  const [room, setRoom] = useState({});
  const { roomID } = useParams();

  useEffect(() => {
    const getRoom = async () => {
      const { data } = await api.getRoom(roomID);
      console.log(data);
      setRoom({ ...room, room: data });
    };
    getRoom();
  }, [roomID]);

  return (
    <>
      {/* <Navbar /> */}
      <StatsContextProvider>
        <RoundSummary />
        <div className="main-container">
          <Rooms />
          <Chat />
          <Miscbar />
        </div>
      </StatsContextProvider>
    </>
  );
};

export default Game;
