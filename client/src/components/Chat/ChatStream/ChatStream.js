import React, { useEffect, useRef, useState } from 'react';

import Avatar from './../../Avatar/Avatar';
import './ChatStream.css';
import ReadMore from './ReadMore';

const ChatStream = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getLocalTime = (timestamp) => {
    let timeUnit = 'am';
    let date = new Date(timestamp);
    let hour = date.getHours();
    let minute = date.getMinutes();
    if (hour > 12) {
      hour = date.getHours() - 12;
      timeUnit = 'pm';
    } else if (hour === 0) {
      hour = 12;
    }
    if (minute < 10) {
      minute = `0${minute}`;
    }
    return `${hour}:${minute} ${timeUnit}`;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const messageStatus = [
    {
      type: 'chat',
      color: 'var(--secondary-blue)',
      icon: 'chat',
    },
    {
      type: 'correct',
      color: 'var(--green)',
      icon: 'check',
    },
    {
      type: 'incorrect',
      color: 'var(--red)',
      icon: 'clear',
    },
    {
      type: 'question',
      color: '#C4CBD0',
      icon: 'help_center',
    },
  ];

  return (
    <div className="chat-stream">
      {messages.map((message, i) => (
        <div
          key={i}
          className="chat-msg"
          style={{
            marginTop: `${
              (i !== 0 && messages[i - 1]?.messageStatus !== 'question') ||
              (message.messageStatus !== 'question' && messages[i - 1]?.messageStatus === 'question')
                ? '5px'
                : null
            }`,
          }}
        >
          <span
            className="material-icons-outlined chat-msg__label"
            style={{
              color: `${messageStatus
                .filter((msgStatus) => msgStatus.type === message.messageStatus)
                .map((ele) => ele.color)}`,
            }}
          >
            {messageStatus.filter((msgStatus) => msgStatus.type === message.messageStatus).map((ele) => ele.icon)}
          </span>
          {message.messageStatus === 'question' ? (
            <h3 className="chat-msg__name">Mod</h3>
          ) : (
            <div className="chat-msg__avatar">
              <Avatar size="35" letter={message.user.charAt(0).toUpperCase()} />
            </div>
          )}
          <div className="chat-msg__main">
            {message.messageStatus === 'question' ? null : (
              <div className="chat-msg__main__user">
                <h3 className="chat-msg__main__user__name">{message.user}</h3>
                <h3 className="chat-msg__main__user__lvl">LVL 8</h3>
              </div>
            )}
            <h4 className="chat-msg__main__content">
              {message.messageStatus === 'question' ? <ReadMore textToDisplay={message.text} /> : message.text}
            </h4>
          </div>
          <h3 className="chat-msg__time">{getLocalTime(message.timestamp)}</h3>
        </div>
      ))}
      <div ref={messagesEndRef} style={{ marginTop: '-17px' }} />
    </div>
  );
};

export default ChatStream;
