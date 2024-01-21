import React, { createContext, useContext, useEffect, useState } from 'react';

const HeaderContext = createContext();

export const useHeaderContext = () => {
  return useContext(HeaderContext);
};

export const HeaderProvider = ({ children }) => {
  const [isHeaderBackgroundHidden, setIsHeaderBackgroundHidden] = useState(false);

  return (
    <HeaderContext.Provider value={{ isHeaderBackgroundHidden, setIsHeaderBackgroundHidden }}>
      {children}
    </HeaderContext.Provider>
  );
};
