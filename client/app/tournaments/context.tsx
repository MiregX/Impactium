'use client'
import { useState, createContext, useContext } from "react";
import { _server } from "@/dto/master";
import { Tournament } from "@/dto/Tournament";

const TournamentsContext = createContext(undefined);

interface TournamentsContext {
  tournaments: Tournament[],
}

export const useTournaments = () => useContext(TournamentsContext) ?? (() => { throw new Error() })();

export const TournamentsProvider = ({
    children,
    prefetched
  }) => {
  const [tournaments, setTournaments] = useState(prefetched || []);

  return (
    <TournamentsContext.Provider value={{
      tournaments, 
      setTournaments
    } as TournamentsContext}>
      {children}
    </TournamentsContext.Provider>
  );
};