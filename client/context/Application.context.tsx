'use client'
import '@/decorator/api';
import '@/decorator/useOptionStyling';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/context/Language.context';
import { Children } from '@/types';
import { Application } from '@impactium/types';
import { toast } from 'sonner';
import { io, Socket } from 'socket.io-client';
import { _server } from '@/decorator/api';
import { λCookie, λError, λWebSocket } from '@impactium/pattern';
import { Blueprint } from '@/dto/Blueprint.dto';
import { Console } from '@impactium/console';
import Cookies from 'universal-cookie';
import { useUser } from './User.context';

const ApplicationContext = createContext<ApplicationContextProps | undefined>(undefined);

export const useApplication = (): ApplicationContextProps => useContext(ApplicationContext)!;

interface ApplicationContextProps {
  copy: (text: string) => PromiseLike<void>,
  spawnBanner: (banner: React.ReactNode) => void,
  destroyBanner: () => void,
  socket: Socket,
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
  const { refreshUser } = useUser();

  useEffect(() => {
    setSocket(io(_server(), {
      path: '/api/ws'
    }));
  }, []);

  useEffect(() => {
    socket?.on(λWebSocket.updateApplicationInfo, a => setApplication(application => Object.assign(application, a)));
    socket?.on(λWebSocket.blueprints, setBlueprints);
    socket?.on(λWebSocket.history, history => setApplication(application => Object.assign({
        ...application,
        history
      })
    ));
    socket?.on(λWebSocket.login, (token) => {
      new Cookies().set(λCookie.Authorization, token);
      refreshUser(token);
    })
  
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

    return () => {
      observer.disconnect();
    };
  }, []);

  const props: ApplicationContextProps = {
    copy,
    socket: socket!,
    blueprints,
    spawnBanner,
    destroyBanner,
    application,
    setApplication
  }

  const onCommand = useCallback((command: string) => {
    const token = new Cookies().get(λCookie.Authorization);
    socket?.emit(λWebSocket.command, { token, command });
  }, [socket]);

  return (
    <ApplicationContext.Provider value={props}>
      {children}
      {banner}
      <Console
        onCommand={onCommand}
        history={application.history}
        title='Impactium'
        trigger='λ'
        icon='https://cdn.impactium.fun/logo/impactium.svg'
        prefix='C:\Mireg\Impactium>' />
    </ApplicationContext.Provider>
  );
};
