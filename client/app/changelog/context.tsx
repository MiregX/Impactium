'use client'
import { useState, createContext, useContext, useEffect } from "react";
import { Changelog } from "@/dto/Changelog";
import { Children } from "@/dto/Children";

const ChangelogContext = createContext<ChangelogContext | undefined>(undefined);

interface ChangelogContext {
  changelog: Changelog[];
  setChangelog: (value: Changelog[]) => void;
}

export const useChangelog = (): ChangelogContext => useContext(ChangelogContext)!

export function ChangelogProvider({ children, prefetched }: Children & { prefetched: Changelog[]}) {
  const [changelog, setChangelog] = useState(prefetched);

  useEffect(() => {
    if (!changelog) {
      setChangelog([]);
    }
  });

  return (
    <ChangelogContext.Provider value={{
      changelog,
      setChangelog,
    }}>
      {children}
    </ChangelogContext.Provider>
  );
};