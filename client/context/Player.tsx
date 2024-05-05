'use client'
import s from '@/styles/Me.module.css'
import { _server } from "@/dto/master";
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

interface APIErrorResponse {
  statusCode: number,
  message: string
}

interface APIPlayerResponse {
  player: IPlayer | APIErrorResponse,
  response: Response
}

interface IPlayerRequest {
  path: string;
  headers?: IPlayerRequestHeaders,
  body?: any
}

interface IPlayerRequestHeaders {
  nickname?: string;
  password?: string;
  achievement?: string;
}

export const setNickname = async ({ nickname }: IPlayerRequestHeaders): Promise<APIPlayerResponse> => {
  return await playerAPI({
    path: 'set/nickname',
    body: {
      nickname
    }
  });
};

export const setPassword = async ({ password }: IPlayerRequestHeaders): Promise<APIPlayerResponse> => {
  return await playerAPI({
    path: 'set/password',
    body: {
      password
    }
  });
};

export const setSkin = async ( { image }: { image: Blob }): Promise<APIPlayerResponse> => {
  const formData = new FormData();
  formData.append('image', image);

  return await playerAPI({
    path: 'set/skin',
    body: formData,
  });
};

export const register = async (): Promise<APIPlayerResponse> => {
  return await playerAPI({
    path: 'register'
  });
};

export const getPlayer = async (token?: string): Promise<APIPlayerResponse> => {
  return await playerAPI({
    path: 'get'
  });
};

export const getAchievements = async (): Promise<APIPlayerResponse> => {
  return await playerAPI({
    path: 'get/achievements'
  });
};

export const setAchievement = async ({ achievement }: IPlayerRequestHeaders): Promise<APIPlayerResponse> => {
  return await playerAPI({
    path: 'set/achievement',
    body: {
      achievement: achievement
    }
  });
};

const playerAPI = async ({ path, headers, body = {} }: IPlayerRequest): Promise<APIPlayerResponse> => {
  try {
    const method = path.startsWith('get')
      ? 'GET'
      : 'POST';

    const response = await fetch(`${_server()}/api/player/` + path, {
      method,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(body)
    });

    const player = await response.json();

    return { player, response };
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
  const [player, setPlayer] = useState<IPlayer>(prefetched);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState<boolean>(!!prefetched);
  const [isPlayerFetched, setIsPlayerFetched] = useState<boolean>(!!prefetched);

  useEffect(() => {
    if (!isPlayerFetched) {
      (async () => {
        const player = await getPlayer();
        setPlayer(player as IPlayer);
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
      <div className={`${s.me} ${isPlayerLoaded && s.geist}`}>
        {children}
      </div>
    </PlayerContext.Provider>
  );
};