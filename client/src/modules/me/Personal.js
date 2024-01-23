import React, { Suspense, useEffect } from 'react';
import './Personal.css';
import Nav from './Nav';
import { useHeaderContext } from '../header/HeaderContext';

const Profile = React.lazy(() => import('./Profile'));

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
      <Suspense fallback={<div>Loading...</div>}>
        <Profile />
      </Suspense>
    </div>
  );
};

export default Personal;
