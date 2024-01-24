import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from './User';
import { useMessage } from '../modules/message/Message';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const { user, isUserLoaded, token } = useUser();
  const { newMessage } = useMessage();
  const [player, setPlayer] = useState(false);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(true);

  const setNickname = async (nickname) => {
    await playerAPI({
      path: 'set/nickname',
      headers: {
        nickname: nickname
      }
    });
  };

  const setPassword = async (password) => {
    await playerAPI({
      path: 'set/password',
      headers: {
        password: password
      }
    });
  };

  const setSkin = async (image) => {
    await playerAPI({
      path: 'set/skin',
      headers: {
        image: image
      }
    });
  };

  const register = async () => {
    await playerAPI({
      path: 'register'
    });
  };

  const getPlayer = async () => {
    await playerAPI({
      path: 'get'
    });
  };

  const getPlayerAchievements = async () => {
    await playerAPI({
      path: 'get/achievements'
    });
  };

  const playerAPI = async ({ path, headers }) => {
    try {
      const method = sourse.startsWith('get')
        ? 'GET'
        : 'POST';

      const response = await fetch('https://impactium.fun/api/player/' + sourse, {
        method,
        headers: {
          'token': token,
          ...headers
        }
      });
      const playerData = await response.json();
      setPlayer(playerData);
      newMessage(response.status, `${lang?.[path.split('/').pop()]?.[response.status]}` || `${lang.undefinedError[response.status]}`)
    } catch (error) {
      setPlayer({});
    }
  };

  useEffect(() => {
    if (!user && isUserLoaded || !user.id) {
      setPlayer({});
      setIsPlayerLoaded(true);
      return
    }

    getPlayer();
  }, [user]);
  
  return (
    <PlayerContext.Provider value={{ player, getPlayer, setPlayer, isPlayerLoaded, setNickname, setPassword, setSkin, register }}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
