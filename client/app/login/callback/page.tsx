'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/context/User';
import { useEffect } from 'react';
import { getServerLink } from '@/dto/master';
import Error from 'next/error';
import Cookies from "universal-cookie";

async function loginCallback(code: string, referal?: string) {
  const res = await fetch(`${getServerLink()}/api/oauth2/callback/discord?code=${code}${referal ? '&ref=' + referal : ''}`, {
    method: 'POST',
    credentials: 'include'
  });
  console.log(res);
  if (!res.ok) return undefined;
  return await res.json();
}

export default function CallbackPage() {
  const cookie = new Cookies();
  const { setToken } = useUser();
  const router = useRouter(); 
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const code = searchParams.get('code');
  
  useEffect(() => {
    if (code) {
      try {
        const x = async () => {
          const res = await loginCallback(code);
          if (!res) throw Error
          cookie.set('Authorization', res.authorization, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            path: '/',
          });
          setToken(res.authorization || false);
        }
        x();
      } catch (_) {
        setToken(false);    
      }
    } else if (token) {
      setToken(token);
    }

    router.push('/');
  }, []);
  
  return null;
};