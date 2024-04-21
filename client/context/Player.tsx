'use client'
import s from '@/styles/Me.module.css'
import { getServerLink } from "@/dto/master";
import { useState, useEffect, createContext, useContext } from "react";
import { Nav } from "@/components/Nav";
import { redirect } from 'next/navigation';

const PlayerContext = createContext(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (!context) throw new Error();
  
  return context;
};

interface IPlayerSkin {
  iconLink: string;
  charlink: string;
  originalTitle: string;
}

export interface IPlayer {
  nickname?: string;
  password?: string;
  skin?: IPlayerSkin;
  registered?: number;
  achievements?: any;
}

interface IPlayerRequest {
  path: string;
  headers?: IPlayerRequestHeaders,
  body?: any
}

interface IPlayerRequestHeaders {
  token: string;
  nickname?: string;
  password?: string;
  achievement?: string;
}

export const setNickname = async ({ token, nickname }: IPlayerRequestHeaders): Promise<IPlayer> => {
  return await playerAPI({
    path: 'set/nickname',
    headers: {
      token,
      nickname
    }
  });
};

export const setPassword = async ({ token, password }: IPlayerRequestHeaders): Promise<IPlayer> => {
  return await playerAPI({
    path: 'set/password',
    headers: {
      token,
      password
    }
  });
};

export const setSkin = async ({ token, image }: { token: string, image: Blob }): Promise<IPlayer> => {
  const formData = new FormData();
  formData.append('image', image);

  return await playerAPI({
    path: 'set/skin',
    headers: {
      token
    },
    body: formData,
  });
};

export const register = async ({ token }: IPlayerRequestHeaders): Promise<IPlayer> => {
  return await playerAPI({
    path: 'register',
    headers: {
      token
    }
  });
};

export const getPlayer = async (token?: string): Promise<IPlayer> => {
  return await playerAPI({
    path: 'get'
  });
};

export const getAchievements = async ({ token }: IPlayerRequestHeaders): Promise<IPlayer> => {
  return await playerAPI({
    path: 'get/achievements',
    headers: {
      token
    }
  });
};

export const setAchievement = async ({ token, achievement }: IPlayerRequestHeaders): Promise<IPlayer> => {
  return await playerAPI({
    path: 'set/achievement',
    headers: {
      token,
      achievement: achievement
    }
  });
};

const playerAPI = async ({ path, headers, body }: IPlayerRequest): Promise<IPlayer> => {
  try {
    const method = path.startsWith('get')
      ? 'GET'
      : 'POST';

    const response = await fetch(`${getServerLink()}/api/player/` + path, {
      method,
      headers: {
        ...headers
      },
      credentials: 'include',
      body
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return undefined
  }
};

export const PlayerProvider = ({
    children,
    prefetched
  } : {
    prefetched: IPlayer
    children: any
  }) => {
  const [player, setPlayer] = useState<IPlayer>(null);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState<boolean>(false);
  const [isPlayerFetched, setIsPlayerFetched] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlayerFetched) {
      (async () => {
        const player = await getPlayer();
        if (!player) {
          throw new Error('Разрабы пидорасы');
        }
        setPlayer(player);
        setIsPlayerFetched(true);
        setIsPlayerLoaded(true);
      })();
    }
  }, [isPlayerFetched]);

  useEffect(() => {
    if (!player) {
      redirect('/');
    }
  }, [player])

  const playerProps = {
    player,
    setPlayer,
    isPlayerLoaded,
    setIsPlayerLoaded,
    isPlayerFetched,
    setIsPlayerFetched
  };
  return (
    <PlayerContext.Provider value={playerProps}>
      <div className={s.me}>
        <Nav />
        {children}
      </div>
    </PlayerContext.Provider>
  );
};