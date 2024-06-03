'use client'
import Cookies from "universal-cookie";
import { useState, useEffect, createContext, useContext } from "react";
import { _server } from "@/dto/master";
import { User } from "@/dto/User";

const UserContext = createContext(undefined);


interface UserContext {
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
  
  return context as UserContext;
};

export const UserProvider = ({
    children,
    prefetched,
    processLogin,
  }) => {
  const cookie = new Cookies();
  const [isUserFetched, setIsUserFetched] = useState(!!prefetched);
  const [user, setUser] = useState<User | null>(prefetched);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(!!prefetched);

  useEffect(() => {
    if (!processLogin) return;
    (async () => {
      await fetch(`${_server()}/api/oauth2/${cookie.get('login_method')}/callback/${cookie.get('login_uuid')}`, {
        method: 'POST',
        credentials: 'include'
      });
      cookie.remove('login_method');
      cookie.remove('login_uuid');
      refreshUser();
    })();
  }, [processLogin])

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