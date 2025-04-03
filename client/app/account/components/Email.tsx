'use client'
import { Language } from "@/context/Language.context";
import { Card } from "@/ui/card";
import s from '../Account.module.css'
import { Badge, Stack } from "@impactium/components";

export function Email() {
  const { lang } = Language.use();

  return (
    <Card.Root className={s.account} id='email' style={{ position: 'relative' }}>
      <Card.Title>{lang.account.email}</Card.Title>
      <Stack className={s.verified} pos='absolute'>
        <Badge variant='blue' value='Verified' icon='ShieldCheck' />
      </Stack>
      <Card.Description>
        <p>{lang.account.email_content}</p>
      </Card.Description>
    </Card.Root>
  );
}