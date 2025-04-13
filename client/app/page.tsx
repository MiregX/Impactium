'use server'
import React from 'react';
import { Button, Stack } from '@impactium/components';
import s from './App.module.css';
import { cn } from '@impactium/utils';
import { Icon } from '@impactium/icons';
import Image from 'next/image';
import dashed_arrow from '@/public/dashed_arrow.png';
import Link from 'next/link';

export default async function () {
  return (
    <main className={s.main}>
      <Stack pos='relative' className={s.wrapper}>
        <Stack dir='column' gap={32} style={{ height: '100%', width: '100%' }} ai='center' jc='center' pos='absolute' className={cn(s.init)}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 64, fontWeight: 600 }}>Магазин кабачковой икры</p>
          <Stack gap={16}>
            <Button rounded size='lg' asChild>
              <Link href='/market/buy'>
                <Icon size={20} name='Coins' />
                Купить
              </Link>
            </Button>
            <Button variant='secondary' rounded size='lg' asChild>
              <Link href='/market/sell'>
                <Icon size={20} name='CreditCard' />
                Продать
              </Link>
            </Button>
          </Stack>
          <Stack pos='relative' className={s.admin_panel}>
            <Button rounded size='lg' img='LogoImpactium' asChild>
              <Link href='/admin'>
                <Icon size={24} name='LogoImpactium' />
                Админ панель
              </Link>
            </Button>
            <Stack pos='absolute' className={s.arrow}>
              <Image src={dashed_arrow} alt='' height={128} width={128} />
              <p>Да ну нахуй</p>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </main>
  );
};
