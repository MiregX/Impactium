'use client'
import { usePathname } from 'next/navigation';
import { Language } from '@/components/LanguageChooser';
import { Header } from '@/components/header/Header';
import { HeaderBackground } from '@/components/header/HeaderBackground';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cookies } from '@/components/header/Cookies';
import Settings from '@/components/header/Settings';

interface HeaderContextProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isHeaderBackgroundHidden: boolean;
  setIsHeaderBackgroundHidden: Dispatch<SetStateAction<boolean>>;
  isFlattenHeader: boolean;
  setIsFlattenHeader: Dispatch<SetStateAction<boolean>>;
  isLogoHiiden: boolean;
  setIsLogoHiiden: Dispatch<SetStateAction<boolean>>;
}

const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

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
  const [isLogoHiiden, setIsLogoHiiden] = useState<boolean>(false);

  useEffect(() => setIsHeaderBackgroundHidden(url === '/'), [url]);

  const headerProps = {
    isLoading,
    setIsLoading,
    isHeaderBackgroundHidden,
    setIsHeaderBackgroundHidden,
    isFlattenHeader,
    setIsFlattenHeader,
    isLogoHiiden,
    setIsLogoHiiden
  }

  return (
    <HeaderContext.Provider value={headerProps}>
      <Header />
      <HeaderBackground />
      <Language />
      <Cookies />
      <Settings />
      {children}
    </HeaderContext.Provider>
  );
};