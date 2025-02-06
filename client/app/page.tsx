'use client'
import React, { useCallback } from 'react';
import { Button, Stack } from '@impactium/components';
import { useUser } from '@/context/User.context';
import { useApplication } from '@/context/Application.context';
import { LoginBanner } from '@/banners/login/Login.banner';
import Link from 'next/link';
import { Icon } from '@impactium/icons';

export default function Main() {
  const { user } = useUser();
  const { spawnBanner } = useApplication();

  const MinecraftAccount = useCallback(() => {
    if (!user) {
      return null;
    }

    return (
      <Button  rounded size='lg' variant='glass' asChild>
        <Link href='/account/minecraft'>
          <Icon name='Box' size={18} />
          Мой майнкрафт аккаунт
        </Link>
      </Button>
      
    )
  }, [user]);

  const roffleButtonClickHandler = () => {
    if (user === null) {
      spawnBanner(<LoginBanner />);
    }
  }

  return (
    <Stack dir='column' gap={32} style={{ height: '100%', width: '100%' }} ai='center' jc='center'>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 64, fontWeight: 600 }}>Магазин кабачковой икры</p>
      <Stack gap={16}>
        <MinecraftAccount />
        <Button onClick={roffleButtonClickHandler} img='Coins' rounded size='lg'>Купить</Button>
        <Button onClick={roffleButtonClickHandler} img='CreditCard' rounded size='lg' variant='secondary'>Продать</Button>
        {Object.keys(Icon.icons).map(n => <Icon name={n as Icon.Name} color='red' />)}
      </Stack>
    </Stack>
  );

};
