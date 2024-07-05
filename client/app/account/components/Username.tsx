'use client'
import { useLanguage } from "@/context/Language.context";
import { Card } from "@/ui/Card";
import s from '../Account.module.css'
import { useUser } from "@/context/User.context";
import { Button, ButtonTypes } from "@/ui/Button";
import { InputMin } from "@/ui/InputMin";
import { Username as RUsername } from '@impactium/pattern'
import { useState } from "react";

export function Username() {
  const { lang } = useLanguage();
  const { user, refreshUser } = useUser();
  const [ username, setUsername ] = useState(user!.uid);
  const [ loading, setLoading ] = useState<boolean>(false);

  const send = async () => {
    setLoading(true);
    await api(`/user/${username}`, {
      method: 'POST'
    }).then(() => { setLoading(false); refreshUser() })
  }

  const button = <Button options={{
    type: ButtonTypes.Button,
    text: lang._save,
    do: send,
    focused: useUsername(user!) !== username && RUsername.test(username),
    disabled: !(useUsername(user!) !== username && RUsername.test(username)),
    loading
  }}/>

  return (
    <Card className={s.account} id='username' description={{ text: lang.account.username_description, button }}>
      <h6>{lang.account.username}</h6>
      <p>{lang.account.username_content}</p>
      <InputMin state={username} setState={setUsername} before='impactium.fun/user/' regExp={{test: RUsername, message: lang.error.indent_invalid_format}} />
    </Card>
  );
}