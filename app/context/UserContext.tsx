"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  user: any; // Adjust the type according to your user data structure
  setUser: React.Dispatch<React.SetStateAction<any>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null); // Adjust the type according to your user data structure
  const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null);

  const logout = () => {
    setToken(null);
  };

  const getUser = async () => {
    try {
      const response = await fetch('https://impactium.fun/api/user/get', {
        method: 'GET',
        headers: {
          'token': token || ''
        }
      });
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      setToken(null);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      getUser();
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);
  
  const contextValue: UserContextType = {
    user,
    setUser,
    token,
    setToken,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
