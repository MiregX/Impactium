'use client'
import { useState, createContext, useContext } from "react";
import { Tournament } from "@/dto/Tournament";
import { Children } from "@/types";

const TournamentContext = createContext<TournamentContext | undefined>(undefined)!;

export interface TournamentContext {
  tournament: Tournament,
  setTournament: (tournament: Tournament) => void,
  assignTournament: (tournament: Tournament) => void,
}

export const useTournament = (): TournamentContext => useContext(TournamentContext) ?? (() => { throw new Error() })();

export function TournamentProvider({ children, prefetched }: Children & { prefetched: Tournament }) {
  const [tournament, setTournament] = useState(prefetched);

  const assignTournament = (newTournament: Tournament) => setTournament(Object.assign(tournament, newTournament));

  return (
    <TournamentContext.Provider value={{
      tournament, 
      setTournament,
      assignTournament
    }}>
      {children}
    </TournamentContext.Provider>
  );
};