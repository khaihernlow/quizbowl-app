import React from 'react';

import './Avatar.css';

const Avatar = ({ size, letter }) => {
  return (
    <div className="avatar__background" style={{ width: `${size}px`, height: `${size}px` }}>
      <h2 className="avatar__letter no-select" style={{ fontSize: `calc(18px / 35 * ${size})` }}>{letter}</h2>
    </div>
  );
};

export default Avatar;
