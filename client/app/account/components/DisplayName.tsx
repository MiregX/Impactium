'use client'
import { useLanguage } from "@/context/Language.context";
import { Card } from "@/ui/Card";
import s from '../Account.module.css'
import { UserRequiredContext, useUser } from "@/context/User.context";
import { Button } from "@impactium/components";
import { DisplayNameBase } from "@impactium/pattern";
import { useState } from "react";
import { User } from "@/dto/User.dto";
import { Input } from "@/ui/Input";

export function DisplayName() {
  const { lang } = useLanguage();
  const { user, assignUser } = useUser<UserRequiredContext>();
  const [ displayName, setDisplayName ] = useState<string>(user.displayName);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ valid, setValid ] = useState<boolean>(true);

  const send = async () => {
    const valid = DisplayNameBase.test(displayName);
    if (!valid) return setValid(false);

    api<User>(`/user/edit`, {
      method: 'PATCH',
      toast: 'user_updated_successfully',
      body: { displayName },
      setLoading
    }, assignUser);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(event.target.value);
    setValid(true);
  }

  const button = <Button
    loading={loading}
    variant={user.displayName !== displayName && valid ? 'default' : 'disabled'}
    onClick={send}>{lang._save}</Button>

  return (
    <Card className={s.account} id='displayName' description={{ text: lang.account.displayName_description, button }}>
      <h6>{lang.account.displayName}</h6>
      <p>{lang.account.displayName_content}</p>
      <Input
        value={displayName}
        onChange={handleChange}
        valid={valid}
      />
    </Card>
  );
}