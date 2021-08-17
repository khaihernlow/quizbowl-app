import React from 'react';
import Chat from '../../components/Chat/Chat';
import Miscbar from '../../components/Miscbar/Miscbar';
import Navbar from '../../components/Navbar/Navbar';
import Rooms from '../../components/Rooms/Rooms';

import './Game.css';

const Game = () => {
  return (
    <>
      <Navbar />
      <div className="main-container">
        <Rooms />
        <Chat />
        <Miscbar />
      </div>
    </>
  );
};

export default Game;
