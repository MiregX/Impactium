'use client'
import '@/decorator/api';
import '@/decorator/useClasses';
import '@/decorator/useDisplayName';
import '@/decorator/useOptionStyling';
import React, { createContext, useContext, useState, useEffect } from 'react';
import s from './Application.module.css';
import { useLanguage } from '@/context/Language.context';
import { Children } from '@/dto/Children';
import { AvailableLanguage } from '@/dto/AvaliableLanguage';
import { Application, ApplicationBase } from '@/dto/Application.dto';
import { Message } from '@/dto/Message.dto';
import { useMessageStatus } from '@/decorator/useMessageStatus';

const ApplicationContext = createContext<IApplicationContext | undefined>(undefined);

export const useApplication = (): IApplicationContext => useContext(ApplicationContext)!;

interface IApplicationContext {
  newMessage: (code: number, text: string) => void;
  copy: (text: string) => PromiseLike<void>,
  spawnBanner: (banner: React.ReactNode) => void,
  destroyBanner: () => void,
  application: Application,
  setApplication: (application: Application) => void,
}

export const ApplicationProvider = ({ children }: Children) => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [application, setApplication] = useState<Application>(ApplicationBase);
  const { lang } = useLanguage();
  const [banner, setBanner] = useState<React.ReactNode>(null);

  const spawnBanner = (element: React.ReactNode) => {
    setBanner(element);
  }

  const destroyBanner = () => {
    setBanner(null);
  }

  const newMessage = (status: number, msg: string) => {
    const message: Message = {
      id: new Date().getTime(),
      status: useMessageStatus(status),
      msg,
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

  useEffect(() => {
    return () => {
      setMessages((prevMessages) => prevMessages.filter((msg) => !msg.hidden));
    };
  }, []);
  
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      newMessage(200, `${text} ${lang.copiedMessage}`);
    } catch (err) {
      newMessage(500, 'Error copying to clipboard');
    }
  };

  const props: IApplicationContext = {
    newMessage,
    copy,
    spawnBanner,
    destroyBanner,
    application,
    setApplication
  } 

  return (
    <ApplicationContext.Provider value={props}>
      {children}
      <div className={s.message}>
        {messages.map((message) => (
          <div key={message.id} itemType={message.status} className={`${s.message} ${message.hidden && s.toHide}`}>
            <p>{message.msg}</p>
          </div>
        ))}
      </div>
      {banner}
    </ApplicationContext.Provider>
  );
};
