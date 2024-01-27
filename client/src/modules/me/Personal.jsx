import React, { useEffect } from 'react';
import './Personal.css';
import Nav from './Nav';
import { useHeaderContext } from '../header/HeaderContext';
import Profile from './Profile';

const Personal = () => {
  const { setIsFlattenHeader } = useHeaderContext();

  useEffect(() => {
    setIsFlattenHeader(true);
    return () => {
      setIsFlattenHeader(false);
    };
  }, []);

  return (
    <div className='personal'>
      <Nav />
      <Profile />
    </div>
  );
};

export default Personal;
