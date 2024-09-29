'use client'
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { useEffect, useRef, useState } from "react";
import s from '@/app/admin/Admin.module.css';
import { useUser } from "@/context/User.context";
import { useRouter } from "next/navigation";
import { Banner } from "@/ui/Banner";

export default function BypassBanner() {
  const [passkey, setPasskey] = useState<string>('');
  const { refreshUser } = useUser();
  const router = useRouter();
  const button_ref = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const submit = () => api<never>(`/user/admin/bypass?key=${passkey}`, {
    raw: true,
    setLoading
  }, refreshUser).then(r => r.isSuccess() && router.push('/admin'));

  const handler = (event: KeyboardEvent) => event.key === 'Enter' && submit();

  useEffect(() => {
    button_ref.current?.addEventListener('keypress', handler);

    return () => button_ref.current?.removeEventListener('keypress', handler);
  }, [button_ref]);

  return (
    <Banner className={s.bypass} title='Съебался в ужасе!'>
      <Input type='password' img='KeyRound' value={passkey} onChange={e => setPasskey(e.target.value)} />
      <Button loading={loading} variant={passkey ? 'default' : 'disabled'} onClick={submit} img='Command'>Try it out</Button>
    </Banner>
  )
}