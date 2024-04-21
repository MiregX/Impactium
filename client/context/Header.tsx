'use client'
import { usePathname } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { HeaderBackground } from '@/components/header/HeaderBackground';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface HeaderContextProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isHeaderBackgroundHidden: boolean;
  setIsHeaderBackgroundHidden: Dispatch<SetStateAction<boolean>>;
  isFlattenHeader: boolean;
  setIsFlattenHeader: Dispatch<SetStateAction<boolean>>;
  isLogoHidden: boolean;
  setIsLogoHidden: Dispatch<SetStateAction<boolean>>;
  isSettingsVisible: boolean;
  setIsSettingsVisible: Dispatch<SetStateAction<boolean>>;
}

const HeaderContext = createContext<HeaderContextProps>(undefined);

export const useHeader = () => {
  const context = useContext(HeaderContext);
  return context;
};

interface HeaderProviderProps {
  children: ReactNode;
}

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const url = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHeaderBackgroundHidden, setIsHeaderBackgroundHidden] = useState<boolean>(url !== '/');
  const [isFlattenHeader, setIsFlattenHeader] = useState<boolean>(url.startsWith('/me'));
  const [isLogoHidden, setIsLogoHidden] = useState<boolean>(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);

  useEffect(() => setIsHeaderBackgroundHidden(url === '/'), [url]);

  const headerProps: HeaderContextProps = {
    isLoading,
    setIsLoading,
    isHeaderBackgroundHidden,
    setIsHeaderBackgroundHidden,
    isFlattenHeader,
    setIsFlattenHeader,
    isLogoHidden,
    setIsLogoHidden,
    isSettingsVisible,
    setIsSettingsVisible
  }

  return (
    <HeaderContext.Provider value={headerProps}>
      <Header />
      <HeaderBackground />
      {children}
    </HeaderContext.Provider>
  );
};