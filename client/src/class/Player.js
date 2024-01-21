import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from './User';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const { user, isUserLoaded, token } = useUser();
  const [player, setPlayer] = useState(false);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(true);

  useEffect(() => {
    if (!user && isUserLoaded) {
      setPlayer({});
      setIsPlayerLoaded(true);
    }

    const fetchData = async () => {
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

    fetchData();
  }, [user]);
  
  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
