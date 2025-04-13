'use client'
import { Language } from "@/context/Language.context";
import { Card } from "@/ui/card";
import s from '../Account.module.css'
import { User } from "@/context/User.context";
import { Button } from "@impactium/components";
import { DisplayNameBase } from "@impactium/types";
import { useState } from "react";
import { Input } from "@/ui/Input";

export function DisplayName() {
  const { lang } = Language.use();
  const { user, assignUser } = User.use<User.RequiredExport>();
  const [displayName, setDisplayName] = useState<string>(user.displayName);
  const [loading, setLoading] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(true);

  const send = async () => {
    const valid = DisplayNameBase.test(displayName);
    if (!valid) return setValid(false);

    api<User.Interface>(`/user/edit`, {
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
    <Card.Root className={s.account} id='displayName'>
      <Card.Title>{lang.account.displayName}</Card.Title>
      <Card.Content>
        <Input
          value={displayName}
          onChange={handleChange}
          valid={valid}
        />
      </Card.Content>
      <Card.Description>
        <p>{lang.account.displayName_content}</p>
      </Card.Description>
    </Card.Root>
  );
}