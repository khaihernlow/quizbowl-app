import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import { SocketContext } from '../../contexts/socket';

import ChatStream from './ChatStream/ChatStream';
import Input from './Input/Input';
import QuestionPanel from './QuestionPanel/QuestionPanel';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [name, setName] = useState(user?.result?.username);
  const [room, setRoom] = useState('ScienceBowl');
  const [question, setQuestion] = useState({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [buzz, setBuzz] = useState({});
  const [newMessage, setNewMessage] = useState();

  useEffect(() => {
    socket.emit('join', { room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);

      if (message.messageStatus === 'correct' || message.messageStatus === 'incorrect') {
        setBuzz({});
        if (message.messageStatus === 'correct') {
          setNewMessage(message);
        }
      }
    });
    socket.on('question', (question) => {
      setQuestion(question);
    });
    socket.on('buzz', (buzz) => {
      setBuzz(buzz);
    });
  }, []);

  const sendMessage = (e, inputMode) => {
    e.preventDefault();

    //if (inputMode === 'buzz') setBuzz({});

    //setMessage((prevMessage) => prevMessage.trim());
    //console.log(message);
    if (message || inputMode === 'buzz') {
      socket.emit('sendMessage', message, inputMode, () => setMessage(''));
    }
  };

  const requestBuzz = () => {
    console.log('buzz requested from client');
    socket.emit('requestBuzz');
  };

  const chatsStyles = {
    position: 'relative',
    // height: 'calc(100vh - 57px)',
    height: '100vh',
    display: 'grid',
    gridTemplateRows: 'max-content auto max-content',
  };

  return (
    <div className="chats" style={chatsStyles}>
      <QuestionPanel question={question} user={user} buzz={buzz} newMessage={newMessage}/>
      <ChatStream messages={messages} />
      <Input message={message} setMessage={setMessage} sendMessage={sendMessage} requestBuzz={requestBuzz} buzz={buzz} />
    </div>
  );
};

export default Chat;
