'use client'
import '@/decorator/api';
import '@/decorator/useClasses';
import '@/decorator/useOptionStyling';
import React, { createContext, useContext, useState, useEffect } from 'react';
import s from './Application.module.css';
import { useLanguage } from '@/context/Language.context';
import { Children } from '@/dto/Children';
import { AvailableLanguage } from '@/dto/AvaliableLanguage';
import { Application, ApplicationBase } from '@/dto/Application.dto';
import { Message } from '@/dto/Message.dto';
import { useMessageStatus } from '@/decorator/useMessageStatus';
import { toast } from 'sonner';

const ApplicationContext = createContext<IApplicationContext | undefined>(undefined);

export const useApplication = (): IApplicationContext => useContext(ApplicationContext)!;

interface IApplicationContext {
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

  useEffect(() => {
    return () => {
      setMessages((prevMessages) => prevMessages.filter((msg) => !msg.hidden));
    };
  }, []);
  
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`${text} ${lang.copiedMessage}`);
    } catch (_) {
      toast('Error copying to clipboard');
    }
  };

  const props: IApplicationContext = {
    copy,
    spawnBanner,
    destroyBanner,
    application,
    setApplication
  } 

  return (
    <ApplicationContext.Provider value={props}>
      {children}
      {banner}
    </ApplicationContext.Provider>
  );
};
