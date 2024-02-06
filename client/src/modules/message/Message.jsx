import React, { createContext, useContext, useState, useEffect } from 'react';
import './Message.css';
import { useLanguage } from '../language/Lang';

const MessageContext = createContext();

export const useMessage = () => {
  return useContext(MessageContext);
};

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const { lang } = useLanguage();

  const newMessage = (code, text) => {
    const type = code < 400 ? 'success' : (code >= 400 && code < 500 ? 'warning' : 'attention');
    const message = {
      id: new Date().getTime(), // Unique ID for each message
      type,
      text,
    };

    setMessages((prevMessages) => [...prevMessages, message]);

    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === message.id ? { ...msg, hidden: true } : msg))
      );
      setTimeout(() => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== message.id));
      }, 500);
    }, 5000);
  };
  
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      newMessage(200, `${text} ${lang.copiedMessage}`);
    } catch (err) {
      newMessage(500, 'Error copying to clipboard');
    }
  };

  useEffect(() => {
    return () => {
      setMessages((prevMessages) => prevMessages.filter((msg) => !msg.hidden));
    };
  }, []);

  return (
    <MessageContext.Provider value={{ newMessage, copy }}>
      {children}
      <div id="messageWrapper">
        {messages.map((message) => (
          <div key={message.id} type={message.type} className={`message${message.hidden ? ' toHide' : ''}`}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
    </MessageContext.Provider>
  );
};
