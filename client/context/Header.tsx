'use client'
import { Header } from '@/components/header/Header';
import React, { createContext, useContext, useState } from 'react';

interface HeaderContextProps {
  isLogoHidden: boolean;
  setIsLogoHidden: (value: boolean) => void;
  isSettingsVisible: boolean;
  setIsSettingsVisible: (value: boolean) => void;
}

const HeaderContext = createContext<HeaderContextProps>(undefined);

export const useHeader = () => {
  const context = useContext(HeaderContext);
  return context;
};

export const HeaderProvider = ({ children }: { children: React.ReactNode}) => {
  const [isLogoHidden, setIsLogoHidden] = useState<boolean>(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);

  const headerProps: HeaderContextProps = {
    isLogoHidden,
    setIsLogoHidden,
    isSettingsVisible,
    setIsSettingsVisible
  }

  return (
    <HeaderContext.Provider value={headerProps}>
      <Header />
      {children}
    </HeaderContext.Provider>
  );
};