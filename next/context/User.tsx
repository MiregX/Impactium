'use client'
import { IUser, getUser } from "@/preset/User";
import Cookies from "universal-cookie";
import { useState, useEffect, createContext, useContext } from "react";

const UserContext = createContext(undefined);

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error();
  
  return context;
};

export const UserProvider = ({
    prefetchedUser = null,
    children
  } : {
    prefetchedUser: IUser | null,
    children: any
  }) => {
  const cookie = new Cookies();
  const [token, setToken] = useState<string | false>((cookie.get('token')) || false);
  const [user, setUser] = useState<IUser | null>(prefetchedUser);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(prefetchedUser ? true : false);

  useEffect(() => {
    if (token) {
      setIsUserLoaded(false);
      getUser(token).then((user) => {
        setUser(user);
      }).catch((error) => {
        setUser(user || null);
      }).finally(() => {
        setIsUserLoaded(true);
      });
    } else {
      cookie.remove('token');
      setUser(null);
    }
  }, [token]);

  const userProps = {
    user,
    setUser,
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