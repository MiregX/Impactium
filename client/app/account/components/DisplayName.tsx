'use client'
import { useLanguage } from "@/context/Language.context";
import { Card } from "@/ui/Card";
import s from '../Account.module.css'
import { useUser } from "@/context/User.context";
import { Button } from "@/ui/Button";
import { InputMin } from "@/ui/InputMin";
import { DisplayName as RDisplayName } from "@impactium/pattern";
import { useState } from "react";

export function DisplayName() {
  const { lang } = useLanguage();
  const { user, refreshUser } = useUser();
  const [ displayName, setDisplayName ] = useState<string>(useDisplayName(user!));
  const [ loading, setLoading ] = useState<boolean>(false);

  const send = async () => {
    setLoading(true);
    await api<boolean>('/user/set/display-name', {
      method: 'POST',
      body: JSON.stringify({ displayName })
    })
    setLoading(false);
    refreshUser();
  }

  const button = <Button
    variant={useDisplayName(user!) !== displayName && RDisplayName.test(displayName) ? 'default' : 'disabled'}
    onClick={send}>{lang._save}</Button>

  return (
    <Card className={s.account} id='displayName' description={{ text: lang.account.displayName_description, button }}>
      <h6>{lang.account.displayName}</h6>
      <p>{lang.account.displayName_content}</p>
      <InputMin
        state={displayName}
        setState={setDisplayName}
        regExp={{
          test: RDisplayName,
          message: lang.error.displayName_invalid_format
      }} />
    </Card>
  );
}