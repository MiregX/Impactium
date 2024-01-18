import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [token] = useState(localStorage.getItem('token') || "c998d2bafe6b606df39fb1c07818a9e92ce8721433acb0b7ad20575efcd48113a515e3d19de1a9faf231f2211a64442427a1926c5c19b56b061ca20fe405627f");

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

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
