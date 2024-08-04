'use client'
import s from './LoginBanner.module.css'
import { Banner } from "@/ui/Banner";
import { LoginMethod } from "./components/LoginMethod";
import { useLanguage } from "@/context/Language.context";
import { TelegramWidget } from '@/components/TelegramWidget';

interface LoginBanner {
  connect?: true
}

export function LoginBanner({ connect }: LoginBanner) {
  const { lang } = useLanguage();
  return (
    <Banner title={connect ? lang.account.connect : lang.login.title}>
      <div className={s._}>
        <TelegramWidget />
        <LoginMethod Type='Discord' />
        <LoginMethod Type='Steam' />
        <LoginMethod Type='Google' disabled={true} />
      </div>
    </Banner>
  )
}