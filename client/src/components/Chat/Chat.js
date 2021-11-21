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

  const sendMessage = (e, inputMode, letterOption) => {
    console.log(letterOption);
    if (e !== null) {
      e.preventDefault();
      if (message || inputMode === 'buzz') {
        socket.emit('sendMessage', message, inputMode, () => setMessage(''));
      }
    } else {
      if (inputMode == 'buzz') {
        socket.emit('sendMessage', letterOption, inputMode, () => setMessage(''));
      }
    }
    //if (inputMode === 'buzz') setBuzz({});

    //setMessage((prevMessage) => prevMessage.trim());
    //console.log(message);
    
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
      <QuestionPanel question={question} user={user} buzz={buzz} newMessage={newMessage} />
      <ChatStream messages={messages} />
      <Input
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        requestBuzz={requestBuzz}
        buzz={buzz}
        question={question}
      />
    </div>
  );
};

export default Chat;
