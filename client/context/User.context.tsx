'use client'
import Cookies from "universal-cookie";
import { useState, useEffect, createContext, useContext } from "react";
import { User, UserAddons, UserEntity } from "@/dto/User";
import { Children } from "@/dto/Children";
import { OAuth2Callback } from "@/dto/OAuth2Callback.dto";

const UserContext = createContext<UserContext | undefined>(undefined);

interface UserContext {
  user: UserEntity<UserAddons> | null,
  setUser: React.Dispatch<React.SetStateAction<UserEntity<UserAddons> | null>>,
  logout: () => void,
  getUser: (authorization?: string) => Promise<User | null>,
  refreshUser: () => void,
  assignUser: (user: User | null) => void,
  isUserLoaded: boolean,
  setIsUserLoaded: (value: boolean) => void,
}

export const useUser = () => useContext(UserContext)!;

export function UserProvider({ children, prefetched }: Children & { prefetched: User<UserAddons> | null }) {
  const cookie = new Cookies();
  const [isUserFetched, setIsUserFetched] = useState(!!prefetched);
  const [user, setUser] = useState<UserEntity<UserAddons> | null>(prefetched ? new UserEntity<UserAddons>(prefetched) : null);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(!!prefetched);

  useEffect(() => {
    !isUserFetched && refreshUser()
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

  const refreshUser = () => getUser().then(user => {
    setUser(user ? new UserEntity(user) : null);
    setIsUserFetched(true);
    setIsUserLoaded(true);
  });

  const assignUser = (user: User | null) => setUser((_user) => new UserEntity(Object.assign({}, _user, user)));

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