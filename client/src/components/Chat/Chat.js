import React from 'react';
import ChatStream from './ChatStream/ChatStream';
import Input from './Input/Input';
import QuestionPanel from './QuestionPanel/QuestionPanel';

const Chat = () => {
  const chatsStyles = {
    position: 'relative',
    height: 'calc(100vh - 57px)',
    display: 'grid',
    gridTemplateRows: 'max-content auto max-content',
  };

  return (
    <div className="chats" style={chatsStyles}>
      <QuestionPanel />
      <ChatStream />
      <Input />
    </div>
  );
};

export default Chat;
