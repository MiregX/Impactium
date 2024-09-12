'use client'
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";
import { ui } from "@impactium/utils";
import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import s from '../Admin.module.css';
import { useUser } from "@/context/User.context";
import { redirect, RedirectType } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AdminBypassPage() {
  const [passkey, setPasskey] = useState<string>('');
  const { refreshUser } = useUser();
  const router = useRouter();
  const button_ref = useRef<HTMLButtonElement>(null);
  const [loading, state] = useState<boolean>(false);

  const submit = () => api<never>(`/user/admin/bypass?key=${passkey}`, { raw: true, state }, refreshUser).then(r => r.isSuccess() && router.push('/admin'));

  const handler = (event: KeyboardEvent) => event.key === 'Enter' && submit();

  useEffect(() => {
    button_ref.current?.addEventListener('keypress', handler);

    return () => button_ref.current?.removeEventListener('keypress', handler);
  }, [button_ref]);

  return (
    <Card className={s.bypass}>
      <h1>Съебался в ужасе!</h1>
      <div>
        <Input type='password' img={ui('specific/key')} value={passkey} onChange={e => setPasskey(e.target.value)} />
        <Button loading={loading} variant={passkey ? 'default' : 'disabled'} onClick={submit} img={ui('specific/command')}>Try it out</Button>
      </div>
    </Card>
  )
}