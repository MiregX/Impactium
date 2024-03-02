'use client'
import { IPlayer, getPlayer } from "@/preset/Player";
import s from '@/styles/Me.module.css'
import Cookies from "universal-cookie";
import { useState, useEffect, createContext, useContext } from "react";
import { useUser } from "./User";
import { Nav } from "@/components/Nav";

const PlayerContext = createContext(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (!context) throw new Error();
  
  return context;
};

export const PlayerProvider = ({
    children,
    prefetchedPlayer = undefined
  } : {
    children: any,
    prefetchedPlayer?: IPlayer | null | undefined
  }) => {
  const cookie = new Cookies();
  const isPlayerPrefetched = typeof prefetchedPlayer !== 'undefined';
  const { token } = useUser();
  const [player, setPlayer] = useState<IPlayer | null>(prefetchedPlayer);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState<boolean>(isPlayerPrefetched ? true : false);

  useEffect(() => {
    if (!isPlayerPrefetched) {
      getPlayer(token).then((player) => {
        setPlayer(player);
      }).catch((error) => {
        setPlayer(player || null);
      }).finally(() => {
        setIsPlayerLoaded(true);
      });
    }
  }, [isPlayerPrefetched]);
  
  useEffect(() => {
    if (token) {
      cookie.set('token', token);
      setIsPlayerLoaded(false);
      getPlayer(token).then((player) => {
        setPlayer(player);
      }).catch((error) => {
        setPlayer(player || null);
      }).finally(() => {
        setIsPlayerLoaded(true);
      });
    } else {
      cookie.remove('token');
      setPlayer(null);
    }
  }, [token]);

  const playerProps = {
    player,
    setPlayer,
    getPlayer,
    isPlayerLoaded,
    setIsPlayerLoaded,
    isPlayerPrefetched
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