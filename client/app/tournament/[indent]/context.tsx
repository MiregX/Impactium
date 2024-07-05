'use client'
import { useState, createContext, useContext } from "react";
import { Tournament } from "@/dto/Tournament";
import { Children } from "@/dto/Children";

const TournamentContext = createContext<TournamentContext | undefined>(undefined)!;

interface TournamentContext {
  tournament: Tournament,
  setTournament: (tournament: Tournament) => void
}

export const useTournament = (): TournamentContext => useContext(TournamentContext) ?? (() => { throw new Error() })();

export function TournamentProvider({ children, prefetched }: Children & { prefetched: Tournament }) {
  const [tournament, setTournament] = useState(prefetched);

  return (
    <TournamentContext.Provider value={{
      tournament, 
      setTournament
    }}>
      {children}
    </TournamentContext.Provider>
  );
};