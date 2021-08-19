import React, { useEffect, useRef } from 'react';

import Avatar from './../../Avatar/Avatar';
import './ChatStream.css';

const ChatStream = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getLocalTime = (timestamp) => {
    let timeUnit = 'am';
    let date = new Date(timestamp);
    let hour = date.getHours();
    if (hour > 12) {
      hour = date.getHours() - 12;
      timeUnit = 'pm';
    } else if (hour === 0) {
      hour = 12;
    }
    return `${hour}:${date.getMinutes()} ${timeUnit}`;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-stream">
      {messages.map((message, i) => (
        <div key={i} className="chat-msg">
          <span
            className="material-icons-outlined chat-msg__label"
            style={{ color: `${message.inputMode === 'chat' ? 'var(--secondary-blue)' : 'var(--green)'}` }}
          >
            {message.inputMode === 'chat' ? 'chat' : 'check'}
          </span>
          <div className="chat-msg__avatar">
            <Avatar size="40" letter={message.user.charAt(0).toUpperCase()} />
          </div>
          <div className="chat-msg__main">
            <div className="chat-msg__main__user">
              <h3 className="chat-msg__main__user__name">{message.user}</h3>
              <h3 className="chat-msg__main__user__lvl">LVL 8</h3>
            </div>
            <h4 className="chat-msg__main__content">{message.text}</h4>
          </div>
          <h3 className="chat-msg__time">{getLocalTime(message.timestamp)}</h3>
        </div>
      ))}
      <div ref={messagesEndRef} style={{ marginTop: '-17px' }} />
    </div>
  );
};

export default ChatStream;
