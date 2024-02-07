import React, { createContext, useContext, useState } from 'react';
import { useUser } from './User';

const TerminalContext = createContext();

export const useTerminal = () => useContext(TerminalContext);

export const TerminalProvider = ({ children }) => {
  const [terminal, setTerminal] = useState(false);
  const { user, token } = useUser();

  const getTerminal = async () => {
    if (!user || !user.isCreator)
      return;
    try {
      const response = await fetch('https://impactium.fun/api/adminTerminal/get', {
        method: 'GET',
        headers: {
          'token': token
        }
      });
      const terminalData = await response.json();
      setTerminal(terminalData);
    } catch (error) {
      setTerminal(false)
    }
  };
  
  return (
    <TerminalContext.Provider value={{ terminal, getTerminal }}>
      {children}
    </TerminalContext.Provider>
  );
};

export default TerminalProvider;
