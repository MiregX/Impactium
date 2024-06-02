'use client'
import s from './LoginBanner.module.css'
import { Banner } from "@/ui/Banner";
import { LoginMethod } from "./components/LoginMethod";
import { useLanguage } from "@/context/Language";

export function LoginBanner() {
  const { lang } = useLanguage();
  return (
    <Banner title={lang.login.title}>
      <div className={s._}>
        <LoginMethod type='Telegram' />
        <LoginMethod type='Steam' disabled={true} />
        <LoginMethod type='Discord' />
        <LoginMethod type='Google' disabled={true} />
      </div>
    </Banner>
  )
}