'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/context/User';
import { useEffect } from 'react';
import { getServerLink } from '@/dto/master';
import { useLanguage } from '@/context/Language';

async function loginCallback(code: string, referal?: string) {
  await fetch(`${getServerLink()}/api/oauth2/callback/discord?code=${code}${referal ? '&ref=' + referal : ''}`, {
    method: 'POST',
    credentials: 'include'
  });
}

export default function CallbackPage() {
  const { setToken } = useUser();
  const router = useRouter(); 
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const code = searchParams.get('code');
  
  useEffect(() => {
    if (code) {
      loginCallback(code).then(_ => router.push('/'));
    } else if (token) {
      setToken(token)
      router.push('/')
    }
  }, []);

  return null;
};