'use client'
import Cookies from "universal-cookie";
import { useState, useEffect, createContext, useContext } from "react";
import { _server } from "@/dto/master";
import { Team } from "@/dto/Team";

const UserContext = createContext(undefined);

interface User {
  teams?: Team[],
  uid: string,
  register: string,
  id: string,
  email?: string
  type: string,
  on: string,
  avatar: string,
  displayName: string,
  lang: string
}

interface IUserContext {
  user: User,
  setUser: (user: User) => void,
  logout: () => void,
  getUser: (authorization?: string) => Promise<any>,
  refreshUser: () => void,
  isUserLoaded: boolean,
  setIsUserLoaded: (value: boolean) => void,
}

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error();
  
  return context as IUserContext;
};

export const UserProvider = ({
    children,
    prefetched
  }) => {
  const cookie = new Cookies();
  const [isUserFetched, setIsUserFetched] = useState(!!prefetched);
  const [user, setUser] = useState<User | null>(prefetched);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(!!prefetched);

  useEffect(() => {
    !isUserFetched && refreshUser()
  }, [isUserFetched]);

  const getUser = async (): Promise<User> => {
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