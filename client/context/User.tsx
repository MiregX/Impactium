'use client'
import Cookies from "universal-cookie";
import { useState, useEffect, createContext, useContext } from "react";
import { FulfilledUser } from "@impactium/types";
import { getUser } from "@/dto/User";

const UserContext = createContext(undefined);

interface IUserContext {
  user: FulfilledUser,
  setUser: (user: FulfilledUser) => void,
  logout: () => void,
  getUser: (authorization?: string) => FulfilledUser | Promise<FulfilledUser>,
  refreshUser: () => void,
  token: string,
  setToken: (token: string) => void,
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
  const [token, setToken] = useState<string>((cookie.get('Authorization')));
  const [user, setUser] = useState<FulfilledUser | null>(prefetchedUser);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(typeof prefetchedUser !== 'undefined');

  const logout = () => {
    setToken('')
    cookie.remove('Authorization');
    cookie.remove('_language');
  };

  const refreshUser = () => {
    setToken(cookie.get('Authorization'))
  };
  
  useEffect(() => {
    if (token) {
      if (isUserFetched) return;
      setIsUserLoaded(false);
      getUser(token).then((user) => {
        setUser(user);
      }).catch((_) => {
        setUser(null);
      }).finally(() => {
        setIsUserFetched(true);
        setIsUserLoaded(true);
      });
    } else {
      cookie.remove('Authorization');
      setUser(null);
    }
  }, [token]);

  const userProps: IUserContext = {
    user,
    setUser,
    logout,
    getUser,
    refreshUser,
    token,
    setToken,
    isUserLoaded,
    setIsUserLoaded
  };
  return (
    <UserContext.Provider value={userProps}>
      {children}
    </UserContext.Provider>
  );
};