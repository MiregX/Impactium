'use client'
import { useLanguage } from "@/context/Language.context";
import { Card } from "@/ui/Card";
import s from '../Account.module.css'
import { useUser } from "@/context/User.context";
import { Button } from "@/ui/Button";
import { InputMin } from "@/ui/InputMin";
import { Identifier } from '@impactium/pattern'
import { useState } from "react";
import { User } from "@/dto/User.dto";

export function Username() {
  const { lang } = useLanguage();
  const { user, assignUser } = useUser();
  const [ username, setUsername ] = useState<string>(user.username);
  const [ loading, setLoading ] = useState<boolean>(false);

  const send = async () => api<User>(`/user/edit`, {
    method: 'PATCH',
    toast: 'user_updated_successfully',
    body: { username },
    setLoading
  }, assignUser);

  const button = <Button
    loading={loading}
    variant={user.username !== username && Identifier.test(username) ? 'default' : 'disabled'}
    onClick={send}>{lang._save}</Button>;

  return (
    <Card className={s.account} id='username' description={{ text: lang.account.username_description, button }}>
      <h6>{lang.account.username}</h6>
      <p>{lang.account.username_content}</p>
      <InputMin
        state={username}
        setState={setUsername}
        before='impactium.fun/user/'
        regExp={{
          test: Identifier.Username,
          message: lang.error.indent_invalid_format
        }} />
    </Card>
  );
}