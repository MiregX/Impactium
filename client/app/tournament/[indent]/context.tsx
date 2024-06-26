'use client'
import { useState, createContext, useContext } from "react";
import { Tournament } from "@/dto/Tournament";
import { ReactNode } from "@/dto/ReactNode";

const TournamentContext = createContext<TournamentContext | undefined>(undefined)!;

interface TournamentContext {
  tournament: Tournament,
  setTournament: (tournament: Tournament) => void
}

export const useTournament = (): TournamentContext => useContext(TournamentContext) ?? (() => { throw new Error() })();

export function TournamentProvider({ children, prefetched }: ReactNode & { prefetched: Tournament }) {
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