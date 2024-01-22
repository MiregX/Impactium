import React, { useEffect, useRef } from 'react';
import './Personal.css';
import Nav from './Nav';
import Profile from './Profile'
import { useHeaderContext } from '../header/HeaderContext';

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