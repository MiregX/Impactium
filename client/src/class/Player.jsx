import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './User';
import { useMessage } from '../modules/message/Message';
import { useLanguage } from '../modules/language/Lang';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const { user, isUserLoaded, token } = useUser();
  const { newMessage } = useMessage();
  const { lang } = useLanguage();
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

  const setAchievement = async (achievement) => {
    await playerAPI({
      path: 'get/achievements',
      headers: {
        achievement: achievement
      }
    });
  };

  const playerAPI = async ({ path, headers }) => {
    if (!token)
      return;
    
    try {
      const method = path.startsWith('get')
        ? 'GET'
        : 'POST';

      const response = await fetch('https://impactium.fun/api/player/' + path, {
        method,
        headers: {
          'token': token,
          ...headers
        }
      });
      if (response.status === 200) {
        const playerData = await response.json();
        setPlayer(playerData);
      } else if (response.status === 500) {
        throw new Error('Internal server error.')
      }
      if (!path.startsWith('get')) {
        newMessage(response.status, `${lang[path.split('/').pop()][response.status]}`);
      }
    } catch (error) {
      setPlayer({});
      newMessage(500, lang.code_500);
    }
  };

  useEffect(() => {
    if ((!user && isUserLoaded) || !user.id) {
      setPlayer({});
      setIsPlayerLoaded(true);
      return
    }

    getPlayer();
  }, [user, isUserLoaded]);
  
  return (
    <PlayerContext.Provider value={{ player, getPlayer, setPlayer, isPlayerLoaded, setNickname, setPassword, setSkin, register, setAchievement }}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
