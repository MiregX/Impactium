'use client'
import { Language } from "@/context/Language.context";
import { Card } from "@/ui/card";
import s from '../Account.module.css'
import { User } from "@/context/User.context";
import { Button, Stack } from "@impactium/components";
import { Identifier } from '@impactium/types'
import { useState } from "react";
import { Input } from "@/ui/Input";

export function Username() {
  const { lang } = Language.use();
  const { user, assignUser } = User.use<User.RequiredExport>();
  const [username, setUsername] = useState<string>(user.username);
  const [loading, setLoading] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(true);

  const send = async () => {
    const valid = Identifier.test(username);

    if (!valid) return setValid(false);

    api<User.Interface>(`/user/edit`, {
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

  return (
    <Card.Root className={s.account} id='username'>
      <Card.Title>{lang.account.username}</Card.Title>
      <Card.Content>
        <Stack className={s.min} gap={0}>
          <div className={s.before}>impactium.fun/user/</div>
          <Input
            value={username}
            onChange={handleChange}
            valid={valid}
          />
        </Stack>
      </Card.Content>
      <Card.Description>
        <p>{lang.account.username_content}</p>
      </Card.Description>
    </Card.Root>
  );
}