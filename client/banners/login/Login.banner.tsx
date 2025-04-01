'use client'
import s from './LoginBanner.module.css'
import { Banner } from '@/ui/Banner';
import { LoginMethod } from './components/LoginMethod';
import { Language } from '@/context/Language.context';
import { TelegramWidget } from './components/TelegramWidget';
import { Separator } from '@/ui/Separator';
import { Configuration } from '@impactium/config';
import { User } from '@/context/User.context';
import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import { Application } from '@/context/Application.context';
import { useRouter } from 'next/navigation';

interface LoginBanner {
  connect?: true
}

export function LoginBanner({ connect }: LoginBanner) {
  const { lang } = Language.use();
  const { destroyBanner } = Application.use();
  const { refreshUser } = User.use();
  const [valid, setValid] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [key, setKey] = useState<string>('');
  const router = useRouter();

  const submit = async () => {
    const token = await api<string>('/user/admin', {
      query: { key },
      setLoading
    })

    if (!token) return setValid(false);

    await refreshUser();
    destroyBanner();
    router.push('/account');
  }

  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setKey(event.currentTarget.value)
    setValid(true)
  };

  return (
    <Banner className={s._} title={connect ? lang.account.connect : lang.login.title}>
      {Configuration.isProductionMode() ? <TelegramWidget /> : <LoginMethod type='telegram' />}
      <Separator />
      <LoginMethod type='discord' />
      <Separator />
      <LoginMethod type='steam' />
    </Banner>
  )
}
