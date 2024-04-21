'use client'
import Cookies from "universal-cookie";
import { useState, useEffect, createContext, useContext } from "react";
import { FulfilledUser } from "@impactium/types";
import { getServerLink } from "@/dto/master";

const UserContext = createContext(undefined);

interface IUserContext {
  user: FulfilledUser,
  setUser: (user: FulfilledUser) => void,
  logout: () => void,
  getUser: (authorization?: string) => FulfilledUser | Promise<FulfilledUser>,
  refreshUser: () => void,
  isUserLoaded: boolean,
  setIsUserLoaded: (value: boolean) => void,
}

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error();
  
  return context;
};

export const UserProvider = ({
    prefetchedUser,
    children
  }) => {
  const cookie = new Cookies();
  const [isUserFetched, setIsUserFetched] = useState(typeof prefetchedUser !== 'undefined');
  const [user, setUser] = useState<FulfilledUser | null>(prefetchedUser);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(typeof prefetchedUser !== 'undefined');

  useEffect(() => {
    if (!isUserFetched) {
      refreshUser();
    }
  }, [isUserFetched, isUserLoaded]);

  const getUser = async () => {
    try {
      const response = await fetch(`${getServerLink()}/api/user/get`, {
        method: 'GET',
        credentials: 'include'
      });
  
      if (!response.ok) throw Error();
  
      return await response.json();
    } catch (_) {
      console.log(_)
      return undefined;
    }    
  };

  const logout = () => {
    cookie.remove('Authorization');
    refreshUser();
  };

  const login = (authorization: string) => {
    cookie.set('Authorization', authorization);
    refreshUser();
  }

  const refreshUser = async () => {
    const user = await getUser();
    setUser(user);
    setIsUserFetched(true);
    setIsUserLoaded(true);
  };

  const userProps: IUserContext = {
    user,
    setUser,
    logout,
    getUser,
    refreshUser,
    isUserLoaded,
    setIsUserLoaded
  };
  return (
    <UserContext.Provider value={userProps}>
      {children}
    </UserContext.Provider>
  );
};