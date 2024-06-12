'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import styles from './Application.module.css';
import { useLanguage } from '@/context/Language';
import { Banner } from '@/ui/Banner';

const ApplicationContext = createContext(undefined);

export const useApplication = () => {
  return useContext(ApplicationContext);
};

export const ApplicationProvider = ({ children, prefetched }) => {
  const [messages, setMessages] = useState([]);
  const [application, setApplication] = useState(prefetched);
  const { lang } = useLanguage();
  const [banner, setBanner] = useState<React.ReactElement>(null);

  const spawnBanner = (element: React.ReactElement) => {
    setBanner(element);
  }

  const destroyBanner = () => {
    setBanner(null);
  }

  const newMessage = (code: number, text: string) => {
    const type = code < 400 ? 'success' : (code >= 400 && code < 500 ? 'warning' : 'attention');

    const message = {
      id: new Date().getTime(),
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
  
  const copy = async (text: string) => {
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
    <ApplicationContext.Provider value={{ newMessage, copy, spawnBanner, destroyBanner, application, setApplication }}>
      {children}
      <div className={styles.messageWrapper}>
        {messages.map((message) => (
          <div key={message.id} itemType={message.type} className={`${styles.message} ${message.hidden && styles.toHide}`}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      {banner}
    </ApplicationContext.Provider>
  );
};
