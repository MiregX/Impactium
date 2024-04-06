'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/context/User';
import { useEffect } from 'react';
import { getServerLink } from '@/dto/master';

async function loginCallback(code: string, referal?: string) {
  const res = await fetch(`${getServerLink()}/api/oauth2/callback/discord?code=${code}${referal ? '&ref=' + referal : ''}`, {
    method: 'POST'
  });
  if (!res.ok) return undefined
  return await res.json();
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
          console.log(authorizationResult);
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