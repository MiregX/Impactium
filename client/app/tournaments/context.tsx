'use client'
import { useState, createContext, useContext } from "react";
import { Tournament } from "@/dto/Tournament";
import { Children } from "@/dto/Children";

const TournamentsContext = createContext<TournamentsContext | undefined>(undefined)!;

interface TournamentsContext {
  tournaments: Tournament[],
  setTournaments: (value: Tournament[]) => void
}

export const useTournaments = () => useContext(TournamentsContext) ?? (() => { throw new Error() })();

export function TournamentsProvider({ children, prefetched }: Children & { prefetched: Tournament[] }) {
  const [tournaments, setTournaments] = useState(prefetched || []);

  return (
    <TournamentsContext.Provider value={{
      tournaments, 
      setTournaments
    }}>
      {children}
    </TournamentsContext.Provider>
  );
};