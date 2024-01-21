import React, { createContext, useContext, useState } from 'react';

const HeaderContext = createContext();

export const useHeaderContext = () => {
  return useContext(HeaderContext);
};

export const HeaderProvider = ({ children }) => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <HeaderContext.Provider value={{ isHidden, setIsHidden }}>
      {children}
    </HeaderContext.Provider>
  );
};
