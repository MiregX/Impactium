'use client'
import { PersonalAvatar } from './components/PersonalAvatar';
import { DisplayName } from './components/DisplayName';
import { Connections } from './components/Connections';
import { Username } from './components/Username';
import { Email } from './components/Email';
import { Nav } from './components/Nav';
import s from './Account.module.css';
import { User } from '@/context/User.context';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { Stack } from '@impactium/components';

export default function AccountPage() {
  const { user } = User.use();

  useEffect(() => {
    if (!user) {
      redirect('/');
    }
  }, [user]);

  return (
    <main className={s.main}>
      <Nav />
      <Stack className={s.wrapper} gap={32} dir='column' ai='stretch'>
        <PersonalAvatar />
        <DisplayName />
        <Username />
        <Email />
        <Connections />
      </Stack>
    </main>
  );
};
