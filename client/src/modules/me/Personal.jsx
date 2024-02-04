import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './Personal.css';
import Nav from './Nav';
import { useHeaderContext } from '../header/HeaderContext';
import Profile from './Profile';
import { usePlayer } from '../../class/Player';
import { useUser } from '../../class/User';

const Terminal = lazy(() => import('./Terminal'));

const Personal = () => {
  const { user } = useUser();
  const { isPlayerLoaded, getPlayer } = usePlayer();
  const { setIsFlattenHeader } = useHeaderContext();

  useEffect(() => {
    setIsFlattenHeader(true);
    return () => {
      setIsFlattenHeader(false);
    };
  }, [setIsFlattenHeader]);

  useEffect(() => {
    if (user.id && !isPlayerLoaded) {
      getPlayer();
    }
  }, [user, getPlayer, isPlayerLoaded]);

  return (
    <div className='personal'>
      <Nav />
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="account" element={<Profile />} />

        {user.isCreator ? (
          <Route path="terminal" element={<Suspense fallback={null}><Terminal /></Suspense>} />
        ) : (
          <Route path="terminal" element={<Navigate to="/me/account" />} />
        )}
      </Routes>
    </div>
  );
};

export default Personal;
