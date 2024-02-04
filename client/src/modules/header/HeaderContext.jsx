import React, { createContext, useContext, useState } from 'react';

const HeaderContext = createContext();

export const useHeaderContext = () => {
  return useContext(HeaderContext);
};

export const HeaderProvider = ({ children }) => {
  const [isHeaderBackgroundHidden, setIsHeaderBackgroundHidden] = useState(false);
  const [isFlattenHeader, setIsFlattenHeader] = useState(false);

  return (
    <HeaderContext.Provider value={{ isHeaderBackgroundHidden, setIsHeaderBackgroundHidden, isFlattenHeader, setIsFlattenHeader }}>
      {children}
    </HeaderContext.Provider>
  );
};
