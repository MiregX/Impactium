'use client'
import { useLanguage } from "@/context/Language.context";
import { Card } from "@/ui/Card";
import s from '../Account.module.css'
import { UserRequiredContext, useUser } from "@/context/User.context";
import { Button } from "@impactium/components";
import { Identifier } from '@impactium/pattern'
import { useState } from "react";
import { User } from "@/dto/User.dto";
import { Input } from "@/ui/Input";

export function Username() {
  const { lang } = useLanguage();
  const { user, assignUser } = useUser<UserRequiredContext>();
  const [username, setUsername] = useState<string>(user.username);
  const [loading, setLoading] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(true);

  const send = async () => {
    const valid = Identifier.test(username);

    if (!valid) return setValid(false);

    api<User>(`/user/edit`, {
      method: 'PATCH',
      toast: 'user_updated_successfully',
      body: { username },
      setLoading
    }, assignUser);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setValid(true);
  }

  const button = <Button
    loading={loading}
    variant={user.username !== username && valid ? 'default' : 'disabled'}
    onClick={send}>{lang._save}</Button>;

  return (
    <Card className={s.account} id='username' description={{ text: lang.account.username_description, button }}>
      <h6>{lang.account.username}</h6>
      <p>{lang.account.username_content}</p>
      <div className={s.min}>
        <div className={s.before}>impactium.fun/user/</div>
        <Input
          value={username}
          onChange={handleChange}
          valid={valid}
        />
      </div>
    </Card>
  );
}