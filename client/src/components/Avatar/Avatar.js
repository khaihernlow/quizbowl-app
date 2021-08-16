import React from 'react';

import './Avatar.css';

const Avatar = ({ size, letter }) => {
  return (
    <div className="avatar__background" style={{ width: size, height: size }}>
      <h2 className="avatar__letter no-select">{letter}</h2>
    </div>
  );
};

export default Avatar;
