import React from 'react';

import './Rooms.css';

const Rooms = () => {
  return (
    <div className="rooms">
      <div className="room">
        <div className="room__icon"></div>
        <div className="room__info">
          <h3 className="room__info__name">Science Bowl</h3>
          <h4 className="room__info__desc">What time was our mee... · 20m</h4>
        </div>
      </div>

      <div className="room">
        <div className="room__icon"></div>
        <div className="room__info">
          <h3 className="room__info__name">History Bowl</h3>
          <h4 className="room__info__desc">What time was our mee... · 20m</h4>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
