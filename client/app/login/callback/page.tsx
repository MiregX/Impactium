'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/context/User';
import { useEffect } from 'react';

async function loginCallback(code: string, referal?: string) {
  const res = await fetch(`localhost:3001/oauth2/callback/discord?code=${code}${referal ? '&ref=' + referal : ''}`, { method: 'GET', cache: 'no-store' })
  if (!res.ok) return undefined
  return res.json()
}

export default function CallbackPage() {
  const { setToken } = useUser();
  const router = useRouter();
 
  const searchParams = useSearchParams();
  const token = searchParams.get('token')
  const code = searchParams.get('code')
  
  useEffect(() => {
    if (code) {
      loginCallback(code).then(authorizationResult => {
        if (authorizationResult) {
          setToken(authorizationResult.token || false);
        }
      });
    } else if (token) {
      setToken(token);
    }

    router.push('/');
  }, []);
  
  return null;
};