'use client'
import { useLanguage } from "@/context/Language.context";
import { Card } from "@/ui/Card";
import s from '../Account.module.css'
import { useUser } from "@/context/User.context";
import { Button } from "@/ui/Button";
import { InputMin } from "@/ui/InputMin";
import { DisplayNameBase } from "@impactium/pattern";
import { useState } from "react";
import { User } from "@/dto/User";

export function DisplayName() {
  const { lang } = useLanguage();
  const { user, refreshUser, assignUser } = useUser();
  const [ displayName, setDisplayName ] = useState<string>(user!.displayName);
  const [ loading, setLoading ] = useState<boolean>(false);

  const send = async () => {
    setLoading(true);
    await api<User>('/user/set/displayname', {
      method: 'POST',
      toast: 'user_updated_successfully',
      body: JSON.stringify({ displayName })
    }, assignUser)
    setLoading(false)
  }

  const button = <Button
    loading={loading}
    variant={user!.displayName !== displayName && DisplayNameBase.test(displayName) ? 'default' : 'disabled'}
    onClick={send}>{lang._save}</Button>

  return (
    <Card className={s.account} id='displayName' description={{ text: lang.account.displayName_description, button }}>
      <h6>{lang.account.displayName}</h6>
      <p>{lang.account.displayName_content}</p>
      <InputMin
        state={displayName}
        setState={setDisplayName}
        regExp={{
          test: DisplayNameBase,
          message: lang.error.displayName_invalid_format
      }} />
    </Card>
  );
}