'use client'
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";
import { ui } from "@impactium/utils";
import Image from 'next/image';
import { useState } from "react";
import s from '../Admin.module.css';
import { useUser } from "@/context/User.context";
import { redirect, RedirectType } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AdminBypassPage() {
  const [passkey, setPasskey] = useState<string>('');
  const { refreshUser } = useUser();
  const router = useRouter();

  const submit = () => api<never>(`/user/admin/bypass?key=${passkey}`, { raw: true }, refreshUser).then(r => r.isSuccess() && router.push('/admin'));

  return (
    <Card className={s.bypass}>
      <Image src='https://cdn.impactium.fun/el/twen.png' alt='' height={-1} width={196} />
      <h2>Съебался в ужасе!</h2>
      <div>
        <Input type='password' img={ui('specific/key')} value={passkey} onChange={e => setPasskey(e.target.value)} />
        <Button variant={passkey ? 'default' : 'disabled'} onClick={submit} img={ui('specific/command')}>Try it out</Button>
      </div>
    </Card>
  )
}