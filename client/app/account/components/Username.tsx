'use client'
import { useLanguage } from "@/context/Language";
import { Card } from "@/ui/Card";
import Image from 'next/image'
import s from '../Account.module.css'
import { useUser } from "@/context/User";
import { GeistButton, GeistButtonTypes } from "@/ui/Button";
import { InputMin } from "@/ui/InputMin";

export function Username() {
  const { lang } = useLanguage();
  const { user } = useUser();

  const button = <GeistButton options={{
    type: GeistButtonTypes.Button,
    text: lang._save
  }}/>

  return (
    <Card className={s.account} description={{ text: lang.account.username_description, button }}>
      <h6>{lang.account.username}</h6>
      <p>{lang.account.username_content}</p>
      <InputMin value={user.uid} before='impactium.fun/user/' />
    </Card>
  );
}