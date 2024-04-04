'use client'
import { IPlayer, getPlayer, getAchievements, setAchievement, setNickname, setSkin, setPassword, register } from "@/dto/Player";
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
    prefetchedPlayer
  } : {
    children: any,
    prefetchedPlayer: IPlayer | null | undefined
  }) => {
  const { token } = useUser();
  const [player, setPlayer] = useState<IPlayer | null>(prefetchedPlayer || {});
  const [isPlayerLoaded, setIsPlayerLoaded] = useState<boolean>(prefetchedPlayer ? true : false);

  useEffect(() => {
    if (!isPlayerLoaded) {
      getPlayer({token}).then((player) => {
        setPlayer(player);
      }).catch((error) => {
        setPlayer(player || null);
      }).finally(() => {
        setIsPlayerLoaded(true);
      });
    }
  }, [isPlayerLoaded]);
  
  useEffect(() => {
    if (token) {
      setIsPlayerLoaded(false);
      getPlayer({ token }).then((player) => {
        setPlayer(player);
      }).catch((error) => {
        setPlayer(player || null);
      }).finally(() => {
        setIsPlayerLoaded(true);
      });
    } else {
      setPlayer(null);
    }
  }, [token]);

  useEffect(() => {
    if (!player) {
      setPlayer({});
      setIsPlayerLoaded(false);
    }
  }, [player])

  const playerProps = {
    token,
    player,
    setPlayer,
    isPlayerLoaded,
    setIsPlayerLoaded
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