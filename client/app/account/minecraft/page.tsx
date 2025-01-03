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
import { useState } from "react";
import { ChangePasswordBanner } from "./ChangePasswordBanner";
import { Separator } from "@/ui/Separator";

export default function AccountMinecraftPage() {
  const { user } = useUser<UserRequiredContext>();
  const { spawnBanner } = useApplication();
  const [loading, setLoading] = useState<boolean>(false);

  const fallback = (
    <img src='https://cdn.impactium.fun/skin/steve_icon.png' alt='' />
  )

  const changePassword = () => {
    spawnBanner(<ChangePasswordBanner />);
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
          <Button img='Check' variant='glass' loading={loading} />
        </Cell>
        <Combination className={s.combination} size='heading' id={user.uid} src={`https://cdn.impactium.fun/skin/${user.username}`} fallback={fallback} name={user.username} />
        <Separator />
        <Stack style={{ width: '100%' }} gap={16}>
          <Label htmlFor='username'>Никнейм:</Label> 
          <Input id='username' img='User' placeholder='Введите новый никнейм' value={user.username} />
        </Stack>
        <Stack style={{ width: '100%' }} gap={16}>
          <Label className={s.label} htmlFor='skin_field'>Cкин:</Label> 
          <Input className={s.label} id='skin_field' type='file' />
        </Stack>
      </Stack>
    </Stack>
    
  )
}