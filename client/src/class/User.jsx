import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || false);

  const logout = () => {
    setToken(false);
  };

  const getUser = async () => {
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
      setToken(false)
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      getUser();
    } else {
      localStorage.removeItem('token');
      setUser({});
    }
  }, [token]);
  
  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
