import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const getUser = () => {
    const token = localStorage.getItem('token') || "c998d2bafe6b606df39fb1c07818a9e92ce8721433acb0b7ad20575efcd48113a515e3d19de1a9faf231f2211a64442427a1926c5c19b56b061ca20fe405627f";
  
    return new Promise(async (resolve, reject) => {
      try {
        if (!token) {
          setUser({});
          setLoading(false);
          resolve();
          return;
        }
  
        setLoading(true);
  
        const response = await fetch('https://impactium.fun/api/getUser', {
          method: 'GET',
          headers: {
            'token': token
          }
        });
  
        const userData = await response.json();
        setUser(userData);
        setLoading(false);
        resolve();
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser({});
        setLoading(false);
        reject(error);
      }
    });
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    getUser();
  };

  const login = (token) => {
    localStorage.setItem('token', token);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, getUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
