import React, { createContext, useContext, useState } from 'react';
import { useUser } from './User';
import { useMessage } from '../modules/message/Message';
import { useLanguage } from '../modules/language/Lang';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const { user, token } = useUser();
  const { newMessage } = useMessage();
  const { lang } = useLanguage();
  const [player, setPlayer] = useState({});
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);

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
    const formData = new FormData();
    formData.append('image', image);
  
    await playerAPI({
      path: 'set/skin',
      body: formData,
    });
  };

  const register = async () => {
    await playerAPI({
      path: 'register'
    });
  };

  const getPlayer = async () => {
    if (!user || !user.id) {
      setPlayer({});
      setIsPlayerLoaded(true);
      return
    }

    setIsPlayerLoaded(false);
    await playerAPI({
      path: 'get'
    });
  };

  const getAchievements = async () => {
    await playerAPI({
      path: 'get/achievements'
    });
  };

  const setAchievement = async (achievement) => {
    await playerAPI({
      path: 'set/achievement',
      headers: {
        achievement: achievement
      }
    });
  };

  const playerAPI = async ({ path, headers, body }) => {
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
        },
        body
      });

      if (response.status === 200) {
        const playerData = await response.json();
        setPlayer(playerData);
        setIsPlayerLoaded(true);
      } else if (response.status === 500) {
        throw new Error('Internal server error.')
      }
      if (!path.startsWith('get')) {
        console.log(path.split('/').pop());
        newMessage(response.status, lang[path.split('/').pop()][response.status.toString()]);
      }
    } catch (error) {
      setPlayer({});
      setIsPlayerLoaded(true);
      newMessage(500, lang.code_500);
    }
  };
  
  return (
    <PlayerContext.Provider value={{ player, getPlayer, isPlayerLoaded, setPlayer, setNickname, setPassword, setSkin, register, setAchievement, getAchievements }}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
