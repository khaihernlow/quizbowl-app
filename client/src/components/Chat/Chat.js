import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import ChatStream from './ChatStream/ChatStream';
import Input from './Input/Input';
import QuestionPanel from './QuestionPanel/QuestionPanel';

let socket;

const Chat = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const [name, setName] = useState(user?.result?.username);
  const [room, setRoom] = useState('ScienceBowl');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:8000/';

  useEffect(() => {
    socket = io(ENDPOINT);
    console.log(socket);

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const sendMessage = (e, inputMode) => {
    e.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, inputMode, () => setMessage(''));
    }
  };

  const chatsStyles = {
    position: 'relative',
    height: 'calc(100vh - 57px)',
    display: 'grid',
    gridTemplateRows: 'max-content auto max-content',
  };

  return (
    <div className="chats" style={chatsStyles}>
      <QuestionPanel />
      <ChatStream messages={messages} />
      <Input
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
