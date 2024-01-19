import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token' || false));

  const getUser = useCallback(async () => {
    if (!token)
      return setUser({});

    try {
      setUser(false)
      fetch('https://impactium.fun/api/getUser', {
        method: 'GET',
        headers: {
          'token': token
        }
      })
        .then(response => response.json())
        .then(userData => {
          setUser(userData);
        });
      
    } catch (error) {
      setUser({});
    }
  }, [token]);

  useEffect(() => {
    getUser();
  }, [token, getUser]);

  useEffect(() => {
    if (typeof token === 'string') localStorage.setItem("token", token);
    else {
      localStorage.removeItem("token", token);
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
