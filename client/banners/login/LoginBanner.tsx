'use client'
import s from './LoginBanner.module.css'
import { Banner } from "@/ui/Banner";
import { LoginMethod } from "./components/LoginMethod";
import { useLanguage } from "@/context/Language";

interface LoginBanner {
  connect?: true
}

export function LoginBanner({ connect }: LoginBanner) {
  const { lang } = useLanguage();
  return (
    <Banner title={connect ? lang.login.title : lang.account.connect}>
      <div className={s._}>
        <LoginMethod Type='Telegram' />
        <LoginMethod Type='Discord' />
        <LoginMethod Type='Steam' />
        <LoginMethod Type='Google' disabled={true} />
      </div>
    </Banner>
  )
}