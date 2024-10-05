'use client'
import Cookies from "universal-cookie";
import { useState, useEffect, createContext, useContext } from "react";
import { User, UserEntity } from "@/dto/User";
import { Children } from "@/types";
import { OAuth2Callback } from "@/dto/OAuth2Callback.dto";
import { λCookie } from "@impactium/pattern";

const UserContext = createContext<UserContext | undefined>(undefined);

interface UserContext {
  user: UserEntity | null,
  setUser: React.Dispatch<React.SetStateAction<UserEntity | null>>,
  logout: () => void,
  getUser: (authorization?: string) => Promise<User | null>,
  refreshUser: () => Promise<void>,
  assignUser: (user: Partial<User> | null) => void,
  isUserLoaded: boolean,
  setIsUserLoaded: (value: boolean) => void,
}

export const useUser = () => useContext(UserContext)!;

export function UserProvider({ children, prefetched }: Children & { prefetched: User | null }) {
  const cookie = new Cookies();
  const [isUserFetched, setIsUserFetched] = useState(!!prefetched);
  const [user, setUser] = useState<UserEntity | null>(prefetched ? new UserEntity(prefetched) : null);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(!!prefetched);

  useEffect(() => {
    !isUserFetched && cookie.get(λCookie.Authorization) && refreshUser()
  }, [isUserFetched]);

  const getUser = () => api<User>('/user/get');

  if (cookie.get('uuid')) {
    api<OAuth2Callback>('/oauth2/telegram/callback', {
      method: 'POST'
    }).then(token => {
      cookie.set('Authorization', token);
      refreshUser();
    });
  }

  const logout = () => {
    cookie.remove('Authorization');
    refreshUser();
  };

  const refreshUser = async () => await getUser().then(user => {
    setUser(user ? new UserEntity(user) : null);
    setIsUserFetched(true);
    setIsUserLoaded(true);
  });

  const assignUser = (user: Partial<User> | null) => setUser((_user) => new UserEntity(Object.assign({}, _user, user)));

  const userProps: UserContext = {
    user,
    setUser,
    logout,
    getUser,
    refreshUser,
    isUserLoaded,
    setIsUserLoaded,
    assignUser,
  };
  return (
    <UserContext.Provider value={userProps}>
      {children}
    </UserContext.Provider>
  );
};