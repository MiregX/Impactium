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
        <LoginMethod Type='Telegram' useCrypto={true} />
        <LoginMethod Type='Discord' />
        <LoginMethod Type='Steam' />
        <LoginMethod Type='Google' disabled={true} />
      </div>
    </Banner>
  )
}