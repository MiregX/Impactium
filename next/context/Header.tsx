'use client'
import Header from '@/components/header/Header';
import HeaderBackground from '@/components/header/HeaderBackground';
import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';

interface HeaderContextProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error();
  }
  return context;
};

interface HeaderProviderProps {
  children: ReactNode;
}

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <HeaderContext.Provider value={{ isLoading, setIsLoading }}>
      <Header />
      <HeaderBackground />
      {children}
    </HeaderContext.Provider>
  );
};
