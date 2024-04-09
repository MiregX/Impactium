'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/context/User';
import { useLanguage } from '@/context/Language';
import { useEffect } from 'react';
import { getServerLink } from '@/dto/master';

export default function CallbackPage() {
  const { setToken, refreshUser, user } = useUser();
  const { refreshLanguage } = useLanguage();
  const router = useRouter(); 
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const code = searchParams.get('code');
  
  async function loginCallback(code: string, referal?: string) {
    await fetch(`${getServerLink()}/api/oauth2/callback/discord?code=${code}${referal ? '&ref=' + referal : ''}`, {
      method: 'POST',
      credentials: 'include'
    });
  }

  useEffect(() => {
    if (!token && !code) {
      return token ? setToken(token) : router.push('/'); 
    }

    loginCallback(code).then(() => {
      refreshUser();
      refreshLanguage();
    });
  }, []);

  useEffect(() => router.push('/'), [user])

  return null;
};