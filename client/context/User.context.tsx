'use client'
import Cookies from "universal-cookie";
import { useState, useEffect, createContext, useContext } from "react";
import { User } from "@/dto/User";
import { Children } from "@/dto/Children";
import { OAuth2Callback } from "@/dto/OAuth2Callback.dto";

const UserContext = createContext<UserContext | undefined>(undefined);

interface UserContext {
  user: User | null,
  setUser: (user: User) => void,
  logout: () => void,
  getUser: (authorization?: string) => Promise<any>,
  refreshUser: () => void,
  isUserLoaded: boolean,
  setIsUserLoaded: (value: boolean) => void,
}

export const useUser = () => useContext(UserContext)!;

export function UserProvider({ children, prefetched }: Children & { prefetched: User | null }) {
  const cookie = new Cookies();
  const [isUserFetched, setIsUserFetched] = useState(!!prefetched);
  const [user, setUser] = useState<User | null>(prefetched);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(!!prefetched);

  useEffect(() => {
    !isUserFetched && refreshUser()
  }, [isUserFetched]);

  const getUser = () => api<User>('/user/get');

  if (cookie.get('uuid')) {
    api<OAuth2Callback>('/oauth2/telegram/callback', {
      method: 'POST'
    }).then(_ => refreshUser());
  }

  const logout = () => {
    cookie.remove('Authorization');
    refreshUser();
  };

  const refreshUser = () => getUser().then(user => {
    setUser(user);
    setIsUserFetched(true);
    setIsUserLoaded(true);
  });

  const userProps: UserContext = {
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