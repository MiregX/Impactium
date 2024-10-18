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
import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import { Button } from '@/ui/Button';
import { useApplication } from '@/context/Application.context';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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
    <Banner ref={self} className={s._} title={connect ? lang.account.connect : lang.login.title}>
      {Configuration.isProductionMode() ? <TelegramWidget /> : <LoginMethod type='telegram' />}
      <Separator />
      <LoginMethod type='discord' />
      <Separator />
      <LoginMethod type='steam' />
      {extended && (
        <Fragment>
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
        </Fragment>
      )}
    </Banner>
  )
}
