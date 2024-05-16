'use client'
import Cookies from "universal-cookie";
import { useState, useEffect, createContext, useContext } from "react";
import { _server } from "@/dto/master";

const UserContext = createContext(undefined);

interface IUserContext {
  user: any,
  setUser: (user: any) => void,
  logout: () => void,
  getUser: (authorization?: string) => Promise<any>,
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
    children,
    prefetched
  }) => {
  const cookie = new Cookies();
  const [isUserFetched, setIsUserFetched] = useState(!!prefetched);
  const [user, setUser] = useState<any | null>(prefetched);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(!!prefetched);

  useEffect(() => {
    !isUserFetched && refreshUser()
  }, [isUserFetched]);

  const getUser = async (): Promise<any> => {
    const res = await fetch(`${_server()}/api/user/get`, {
      method: 'GET',
      credentials: 'include'
    });

    return res.ok ? await res.json() : undefined;
  };

  const logout = () => {
    cookie.remove('Authorization');
    refreshUser();
  };

  const refreshUser = () => {
    getUser().then(user => {
      setUser(user);
      setIsUserFetched(true);
      setIsUserLoaded(true);
    });
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