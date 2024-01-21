import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token' || false));

  useEffect(() => {
    if (!token && isUserLoaded) {
      setUser({});
      setIsUserLoaded(true);
    }

    localStorage.setItem('token', token);

    const fetchData = async () => {
      try {
        const response = await fetch('https://impactium.fun/api/user/get', {
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
  
  return (
    <UserContext.Provider value={{ user, token, setUser, setToken, isUserLoaded, setIsUserLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
