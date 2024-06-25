'use client'
import { useState, createContext, useContext, useEffect } from "react";
import { Changelog } from "@/dto/Changelog";

const ChangelogContext = createContext(undefined);

interface ChangelogContext {
  changelog: Changelog[];
  setChangelog: (value: Changelog[]) => void;
}

export const useChangelog = () => useContext(ChangelogContext) || (() => {throw new Error()})();

export const ChangelogProvider = ({
    children,
    prefetched
  }) => {
  const [changelog, setChangelog] = useState(prefetched);

  useEffect(() => {
    if (!changelog) {
      setChangelog([]);
    }
  });

  const props: ChangelogContext = {
    changelog,
    setChangelog,
  }

  return (
    <ChangelogContext.Provider value={props}>
      {children}
    </ChangelogContext.Provider>
  );
};