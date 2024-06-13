'use client'
import { useState, createContext, useContext } from "react";
import { _server } from "@/dto/master";
import { Tournament } from "@/dto/Tournament";

const TournamentContext = createContext(undefined);

interface TournamentContext {
  tournament: Tournament,
}

export const useTournaments = () => useContext(TournamentContext) ?? (() => { throw new Error() })();

export const TournamentProvider = ({
    children,
    prefetched
  }) => {
  const [tournament, setTournament] = useState(prefetched);

  return (
    <TournamentContext.Provider value={{
      tournament, 
      setTournament
    } as TournamentContext}>
      {children}
    </TournamentContext.Provider>
  );
};