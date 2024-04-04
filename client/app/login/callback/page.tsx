'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/context/User';
import { useEffect } from 'react';
import { getLink } from '@/dto/master';

async function loginCallback(code: string, referal?: string) {
  const res = await fetch(`${getLink()}/api/oauth2/callback/discord?code=${code}${referal ? '&ref=' + referal : ''}`)
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