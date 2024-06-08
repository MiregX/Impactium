'use client'
import { useLanguage } from "@/context/Language";
import { Card } from "@/ui/Card";
import Image from 'next/image'
import s from '../Account.module.css'
import { useUser } from "@/context/User";

export function Avatar() {
  const { lang } = useLanguage();
  const { user } = useUser();

  return (
    <Card className={s.account} id='avatar' description={lang.account.avatar_description}>
      <h6>{lang.account.avatar}</h6>
      <p>{lang.account.avatar_content}</p>
      <div className={s.avatar}>
        <Image width={78} height={78} src={user.login.avatar} alt='' />
      </div>
    </Card>
  );
}