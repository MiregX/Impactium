'use client'
import '@/decorator/api';
import '@/decorator/useOptionStyling';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from '@/context/Language.context';
import { Children } from '@/types';
import { Application } from '@impactium/types';
import { toast } from 'sonner';
import { io, Socket } from 'socket.io-client';
import { _server } from '@/decorator/api';
import { λError, λWebSocket } from '@impactium/pattern';
import { Blueprint } from '@/dto/Blueprint.dto';

const ApplicationContext = createContext<ApplicationContextProps | undefined>(undefined);

export const useApplication = (): ApplicationContextProps => useContext(ApplicationContext)!;

interface ApplicationContextProps {
  copy: (text: string) => PromiseLike<void>,
  spawnBanner: (banner: React.ReactNode) => void,
  destroyBanner: () => void,
  application: Application,
  setApplication: (application: Application) => void,
  blueprints: Blueprint[]
}

interface ApplicationProviderProps extends Children {
  application: Application;
  blueprints: Blueprint[];
}

export const ApplicationProvider = ({ children, application: λapplication, blueprints: λblueprints }: Children & ApplicationProviderProps) => {
  const [application, setApplication] = useState<Application>(λapplication);
  const [blueprints, setBlueprints] = useState<Blueprint[]>(λblueprints);
  const { lang } = useLanguage();
  const [banner, setBanner] = useState<React.ReactNode>(null);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    setSocket(io(_server(), {
      path: '/api/ws'
    }));
  }, []);
  
  useEffect(() => {
    socket?.on(λWebSocket.updateApplicationInfo, setApplication);
    socket?.on(λWebSocket.blueprints, setBlueprints);
  
    return () => {
      socket?.disconnect()
    };
  }, [socket]);

  useEffect(() => {
    if (!blueprints.length && socket) {
      socket.emit(λWebSocket.blueprints);
    }
  }, [blueprints, socket]);

  const spawnBanner = (element: React.ReactNode) => {
    setBanner(element);
  }

  const destroyBanner = () => {
    setBanner(null);
  }
  
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`${text} ${lang.copied.title}`, {
        description: lang.copied.description
      });
    } catch (_) {
      toast('Error copying to clipboard');
    }
  };

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === λError.data_scroll_locked) {
          document.body.removeAttribute(λError.data_scroll_locked);
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [λError.data_scroll_locked],
    });

    document.body.removeAttribute(λError.data_scroll_locked);

    return observer.disconnect;
  }, []);

  const props: ApplicationContextProps = {
    copy,
    blueprints,
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
