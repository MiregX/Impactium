'use client'
import Cookies from "universal-cookie";
import { useState, useEffect, createContext, useContext } from "react";
import { FulfilledUser } from "@impactium/types";
import { getUser } from "@/dto/User";

const UserContext = createContext(undefined);

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
  const [token, setToken] = useState<string | false>((cookie.get('Authorization')) || false);
  const [user, setUser] = useState<FulfilledUser | null>(prefetchedUser);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(typeof prefetchedUser !== 'undefined');

  const logout = () => {
    setToken(false)
  };
  
  useEffect(() => {
    if (token) {
      if (isUserFetched) return;
      cookie.set('Authorization', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: '/',
      });
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

  const userProps = {
    user,
    setUser,
    logout,
    getUser,
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