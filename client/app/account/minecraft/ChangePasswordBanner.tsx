'use client'

import { useApplication } from "@/context/Application.context"
import { Banner } from "@/ui/Banner"
import { Input } from "@/ui/Input"
import { Button, Cell } from "@impactium/components"
import { Color } from "@impactium/design"
import { ChangeEvent, useEffect, useState } from "react"
import { toast } from "sonner"

export function ChangePasswordBanner() {
  const { destroyBanner } = useApplication();
  const [password, setPassword] = useState<string>('');
  const [passwordRepeat, setPasswordRepeat] = useState<string>('');
  const [valid, setValid] = useState<boolean>(true);
  const [isMatches, setIsMatches] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (passwordRepeat) {
      setIsMatches(password === passwordRepeat);
    }
  }, [password, passwordRepeat]);

  const confirmationPasswordInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setPasswordRepeat(value);
  }

  const passwordInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setValid(value.length >= 3);

    setPassword(value);
  }

  const confirm = () => {
    api<boolean>('/user/edit/password', {
      method: 'POST',
      setLoading,
      body: JSON.stringify({
        password
      })
    }, destroyBanner).then(isValid => {
      if (isValid) {
        destroyBanner();
      } else {
        setValid(false);
      }
      
    })
  }

  return (
    <Banner title='Change password'>
      <Cell background={Color.toVar('soft-black')} top left />
      <Cell background={Color.toVar('soft-black')} top right>
        <Button variant='ghost' img='X' onClick={destroyBanner} />
      </Cell>
      <Cell background={Color.toVar('soft-black')} bottom left />
      <Cell background={Color.toVar('soft-black')} bottom right>
        <Button onClick={confirm} loading={loading} img='Check' variant='glass' disabled={!valid || !isMatches || password.length === 0 || password.length !== passwordRepeat.length} />
      </Cell>
      <Input type='password' valid={valid} onChange={passwordInputHandler} value={password} img='KeyRound' placeholder='Новый пароль' />
      <Input type='password' valid={isMatches} onChange={confirmationPasswordInputHandler} value={passwordRepeat} img='KeyRound' placeholder='Повторите пароль' />
    </Banner>
  )
}