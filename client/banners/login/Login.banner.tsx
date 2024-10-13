'use client'
import s from './LoginBanner.module.css'
import { Banner } from "@/ui/Banner";
import { LoginMethod } from "./components/LoginMethod";
import { useLanguage } from "@/context/Language.context";
import { TelegramWidget } from './components/TelegramWidget';
import { Separator } from '@/ui/Separator';
import { Configuration } from '@impactium/config';
import { Input } from '@/ui/Input';
import { useUser } from '@/context/User.context';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/ui/Button';
import { useApplication } from '@/context/Application.context';

interface LoginBanner {
  connect?: true
}

export function LoginBanner({ connect }: LoginBanner) {
  const { lang } = useLanguage();
  const { destroyBanner } = useApplication();
  const { refreshUser } = useUser();
  const [valid, setValid] = useState<boolean>(true);
  const [extended, setExtended] = useState<boolean>(false);
  const self = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [key, setKey] = useState<string>('');

  const handleKeyPress = (event: KeyboardEvent) => {
    const handle = event.key === 'F12'
    console.log(event.key)
    if (handle) {
      event.preventDefault();
      setExtended(e => !e);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress)
    };

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyPress)
      }
    }
  }, []);

  const submit = async () => {
    setLoading(true);
    const token = await api<string>('/user/admin', {
      query: { key },
      setLoading
    });

    if (!token) return setValid(false);

    await refreshUser();
    destroyBanner();
  }

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKey(event.currentTarget.value)
    setValid(true)};

  return (
    <Banner ref={self} className={s._} title={connect ? lang.account.connect : lang.login.title}>
      {Configuration.isProductionMode() ? <TelegramWidget /> : <LoginMethod type='telegram' />}
      <Separator />
      <LoginMethod type='discord' />
      <Separator />
      <LoginMethod type='steam' />
      {extended && (
        <>
          <Separator><i>Администаторам</i></Separator>
          <div className={s.bypass}>
            <Input
              valid={valid}
              placeholder='Ключ-фраза'
              onChange={inputChangeHandler}
              value={key}
              img='KeyRound'
              type='password' />
            <Button
              loading={loading}
              variant={key.length && valid ? 'default' : 'disabled'} onClick={submit}>Войти</Button>
          </div>
        </>
      )}
    </Banner>
  )
}
