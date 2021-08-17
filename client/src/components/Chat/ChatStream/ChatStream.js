import React from 'react';

import Avatar from './../../Avatar/Avatar';
import './ChatStream.css';

const ChatStream = () => {
  return (
    <div className="chat-stream">
      <div className="chat-msg">
        <span
          className="material-icons-outlined chat-msg__label"
          style={{ color: 'var(--green)' }}
        >
          check
        </span>
        <div className="chat-msg__avatar">
          <Avatar size="40" letter="K" />
        </div>
        <div className="chat-msg__main">
          <div className="chat-msg__main__user">
            <h3 className="chat-msg__main__user__name">khaihern</h3>
            <h3 className="chat-msg__main__user__lvl">LVL 8</h3>
          </div>
          <h4 className="chat-msg__main__content">strontium hydroxide</h4>
        </div>
        <h3 className="chat-msg__time">8:24 pm</h3>
      </div>
    </div>
  );
};

export default ChatStream;
