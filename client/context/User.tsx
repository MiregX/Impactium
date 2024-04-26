'use client'
import Cookies from "universal-cookie";
import { useState, useEffect, createContext, useContext } from "react";
import { UserComposedEntity } from '@api/main/user/entities/user.entity'
import { getServerLink } from "@/dto/master";

const UserContext = createContext(undefined);

interface IUserContext {
  user: UserComposedEntity,
  setUser: (user: UserComposedEntity) => void,
  logout: () => void,
  getUser: (authorization?: string) => Promise<UserComposedEntity>,
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
    children
  }) => {
  const cookie = new Cookies();
  const [isUserFetched, setIsUserFetched] = useState(false);
  const [user, setUser] = useState<UserComposedEntity | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false);

  useEffect(() => !isUserFetched && refreshUser(), [isUserFetched]);

  const getUser = async (): Promise<UserComposedEntity> => {
    const res = await fetch(`${getServerLink()}/api/user/get`, {
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