'use client'
import { Button, Cell, Stack } from "@impactium/components";
import s from './page.module.css';
import { Color } from "@impactium/design";
import { Input } from "@/ui/Input";
import { Icon } from "@impactium/icons";
import { UserRequiredContext, useUser } from "@/context/User.context";
import { Label } from "@/ui/Label";
import { Combination } from "@/ui/Combitation";
import { useApplication } from "@/context/Application.context";
import { ChangeEvent, useEffect, useState } from "react";
import { ChangePasswordBanner } from "./ChangePasswordBanner";
import { Separator } from "@/ui/Separator";
import { redirect } from "next/navigation";
import { Identifier } from "@impactium/pattern";

export default function AccountMinecraftPage() {
  const { user } = useUser<UserRequiredContext>();
  const [username, setUsername] = useState<string>(user.username);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);
  const { spawnBanner } = useApplication();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user === null) {
      redirect('/')
    }
  }, [user]);

  const fallback = (
    <img src='https://cdn.impactium.fun/skin/steve_icon.png' alt='' />
  )

  const changePassword = () => {
    spawnBanner(<ChangePasswordBanner />);
  }

  const submit = () => {
    api<boolean>('/user/edit/minecraft', {
      method: 'POST',
      body: JSON.stringify({
        username: user.username
      })
    });
  }

  const usernameInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value.length >= 3) {
      setIsUsernameValid(Identifier.Username.test(value));
    } else {
      setIsUsernameValid(true);
    }

    setUsername(value);
  }

  const skinInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
  }

  return (
    <Stack style={{ height: '100%', width: '100%' }} ai='center' jc='center'>
      <Stack className={s.wrapper} dir='column' ai='center' jc='center' pos='relative'>
        <Cell background={Color.toVar('soft-black')} top left />
        <Cell background={Color.toVar('soft-black')} top right />
        <Cell background={Color.toVar('soft-black')} bottom left>
          <Button img='KeyRound' variant='ghost' onClick={changePassword} />
        </Cell>
        <Cell background={Color.toVar('soft-black')} bottom right>
          <Button disabled={username.length < 3 || !isUsernameValid} img='Check' variant='glass' loading={loading} onClick={submit} />
        </Cell>
        <Combination className={s.combination} size='heading' id={user.uid} src={`https://cdn.impactium.fun/skin/${user.username}`} fallback={fallback} name={user.username} />
        <Separator />
        <Stack dir='column' style={{ width: '100%' }} gap={16}>
          <Label htmlFor='username'>Никнейм:</Label> 
          <Input id='username' value={username} onChange={usernameInputChangeHandler} img='User' placeholder='Введите новый никнейм' />
        </Stack>
        <Stack dir='column' style={{ width: '100%' }} gap={16}>
          <Label className={s.label} htmlFor='skin_field'>Cкин:</Label>
          <Input className={s.label} id='skin_field' onChange={skinInputChangeHandler} type='file' />
        </Stack>
      </Stack>
    </Stack>
    
  )
}