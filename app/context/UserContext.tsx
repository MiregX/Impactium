"use client"
import React, { Dispatch, SetStateAction, createContext, useContext, useState, useEffect } from 'react';

interface IUser {
  isVerified: boolean;
  balance: number;
  avatar: string;
  id: string;
  displayName: string;
}

interface IUserContext {
  user: IUser | false;
  setUser: Dispatch<SetStateAction<IUser | false>>;
  token: string | false;
  setToken: Dispatch<SetStateAction<string | false>>;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const useUser = (): IUserContext => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error();
  return context;
};


export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | false>(false);
  const [token, setToken] = useState<string | false>(localStorage.getItem('token') || false);

  const getUser = async () => {
    try {
      if (!token)
        return;

      const response = await fetch('https://impactium.fun/api/user/get', {
        method: 'GET',
        headers: {
          'token': token || ''
        }
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      setToken(false);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      getUser();
    } else {
      localStorage.removeItem('token');
      setUser(false);
    }
  }, [token]);
  
  const props: IUserContext = {
    user,
    setUser,
    token,
    setToken,
  };

  return (
    <UserContext.Provider value={props}>
      {children}
    </UserContext.Provider>
  );
};
