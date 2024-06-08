'use client'
import { useLanguage } from "@/context/Language";
import { Card } from "@/ui/Card";
import s from '../Account.module.css'
import { useUser } from "@/context/User";
import { GeistButton, GeistButtonTypes } from "@/ui/Button";
import { InputMin } from "@/ui/InputMin";

export function DisplayName() {
  const { lang } = useLanguage();
  const { user } = useUser();

  const button = <GeistButton options={{
    type: GeistButtonTypes.Button,
    text: lang._save
  }}/>

  return (
    <Card className={s.account} description={{ text: lang.account.displayName_description, button }}>
      <h6>{lang.account.displayName}</h6>
      <p>{lang.account.displayName_content}</p>
      <InputMin value={user.login.displayName} />
    </Card>
  );
}