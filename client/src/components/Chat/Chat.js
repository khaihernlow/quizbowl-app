import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import { SocketContext } from '../../contexts/socket';
import { StatsContext } from '../../contexts/stats';

import ChatStream from './ChatStream/ChatStream';
import Input from './Input/Input';
import QuestionPanel from './QuestionPanel/QuestionPanel';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const { roundQuestions, setRQuestion } = useContext(StatsContext);
  const [name, setName] = useState(user?.result?.username);
  const [room, setRoom] = useState('ScienceBowl');
  const [question, setQuestion] = useState({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [buzz, setBuzz] = useState({});
  const [newMessage, setNewMessage] = useState();
  const [lockBuzz, setLockBuzz] = useState(false);

  let currentQuestion = {
    question: '',
    status: 'unattempted',
  };

  useEffect(() => {
    socket.emit('join', { room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [socket]);

  useEffect(() => {
    let startTime, latency, testTime;
    setInterval(function () {
      startTime = Date.now();
      socket.emit('ping');
    }, 2000);

    socket.on('pong', function () {
      latency = Date.now() - startTime;
      // console.log(`Ping: ${latency}ms`);
    });
    socket.on('message', (message) => {
      console.log('Current Time: ' + new Date());
      console.log(((5.0 - (new Date(testTime).getTime() - new Date().getTime()) / 1000) / 5.0) * 100);
      setMessages((messages) => [...messages, message]);

      if (message.messageStatus === 'correct' || message.messageStatus === 'incorrect') {
        setBuzz({});
        if (message.messageStatus === 'correct') {
          setNewMessage(message);
        }
      }
    });
    socket.on('question', (question) => {
      testTime = new Date(question.unreadEndTime);
      console.log('UnreadEndTime: ' + new Date(question.unreadEndTime));
      setQuestion(question);
    });
    socket.on('buzz', (buzz) => {
      console.log('BuzzEndTime: ' + new Date(buzz.buzzEndTime));
      setBuzz(buzz);
      console.log('Current Time: ' + new Date());
    });
    socket.on('buzzLockCtrl', (buzzLock) => {
      setLockBuzz(buzzLock.buzzLock);
    });
    socket.on('questionInfo', (packet) => {
      setRQuestion({
        question: packet.question,
        answer: packet.answer,
        status: packet.status,
        user_answer: packet.user_answer,
      });
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
        lockBuzz={lockBuzz}
      />
    </div>
  );
};

export default Chat;
