'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import Cookies from 'universal-cookie';
import { useUser } from '@/context/User';
import { useEffect } from 'react';

async function loginCallback(code: string, referal?: string | false) {
  const res = await fetch(`https://impactium.fun/oauth2/callback/discord?code=${code}${referal ? '&ref=' + referal : ''}`, { method: 'GET', cache: 'no-store' })
  if (!res.ok) return undefined
  return res.json()
}

export default function CallbackPage(request, response) {
  const { setToken } = useUser();
  const router = useRouter();
  const cookie = new Cookies(request.headers.cookie);
  const referal = cookie.get('ref') || false;
 
  const searchParams = useSearchParams();
  const token = searchParams.get('token')
  const code = searchParams.get('code')
  
  useEffect(() => {
    if (code) {
      loginCallback(code, referal).then(authorizationResult => {
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