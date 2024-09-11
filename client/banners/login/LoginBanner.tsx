'use client'
import s from './LoginBanner.module.css'
import { Banner } from "@/ui/Banner";
import { LoginMethod } from "./components/LoginMethod";
import { useLanguage } from "@/context/Language.context";
import { TelegramWidget } from './components/TelegramWidget';
import { Separator } from '@/ui/Separator';

interface LoginBanner {
  connect?: true
}

export function LoginBanner({ connect }: LoginBanner) {
  const { lang } = useLanguage();
  return (
    <Banner className={s._} title={connect ? lang.account.connect : lang.login.title}>
      <LoginMethod type='discord' />
      <Separator />
      <LoginMethod type='steam' />
      <Separator />
      <TelegramWidget />
    </Banner>
  )
}