import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children, setIsPreloaderHidden }) => {
  const [user, setUser] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token' || false));

  useEffect(() => {
    localStorage.setItem('token', token);
    setIsUserLoaded(false);

    const fetchData = async () => {
      try {
        const response = await fetch('https://impactium.fun/api/getUser', {
          method: 'GET',
          headers: {
            'token': token
          }
        });
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        setUser({});
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
  }, [token]);

  useEffect(() => {
    if (user) {
      setIsUserLoaded(true);
    }
  }, [user]);
  
  return (
    <UserContext.Provider value={{ user, token, setToken, isUserLoaded, setIsUserLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
