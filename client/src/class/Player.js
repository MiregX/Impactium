import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from './User';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const { user, isUserLoaded, token } = useUser();
  const [player, setPlayer] = useState(false);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(true);

  const setNickname = async (nickname) => {
    try {
      const response = await fetch('https://impactium.fun/api/player/set/nickname', {
        method: 'POST',
        headers: {
          'token': token,
          'nickname': nickname
        }
      });
      const playerData = await response.json();
      setPlayer(playerData);
    } catch (error) {
      setPlayer({});
    }
  };

  const setPassword = async (password) => {
    try {
      const response = await fetch('https://impactium.fun/api/player/set/password', {
        method: 'POST',
        headers: {
          'token': token,
          'password': password
        }
      });
      const playerData = await response.json();
      setPlayer(playerData);
    } catch (error) {
      setPlayer({});
    }
  };

  const setSkin = async (image) => {
    try {
      const response = await fetch('https://impactium.fun/api/player/set/skin', {
        method: 'POST',
        headers: {
          'token': token,
          'image': image
        }
      });
      const playerData = await response.json();
      setPlayer(playerData);
    } catch (error) {
      setPlayer({});
    }
  };

  const register = async () => {
    if (player.registered)
      return;

    try {
      const response = await fetch('https://impactium.fun/api/player/register', {
        method: 'POST',
        headers: {
          'token': token
        }
      });
      const playerData = await response.json();
      setPlayer(playerData);
    } catch (error) {
      setPlayer({});
    }
  };

  const getPlayer = async () => {
    try {
      const response = await fetch('https://impactium.fun/api/player/get', {
        method: 'GET',
        headers: {
          'token': token
        }
      });
      const playerData = await response.json();
      setPlayer(playerData);
    } catch (error) {
      setPlayer({});
    }
  };

  useEffect(() => {
    if (!user && isUserLoaded) {
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
