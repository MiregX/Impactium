'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/context/User';
import { useLanguage } from '@/context/Language';
import { useEffect } from 'react';
import { getServerLink } from '@/dto/master';
import Cookies from 'universal-cookie';

export default function CallbackPage() {
  const { refreshUser, setIsUserLoaded } = useUser();
  const { refreshLanguage } = useLanguage();
  const router = useRouter();
  const cookies = new Cookies();
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
    setIsUserLoaded(false);
    (async () => {
      if (token) {
        cookies.set('Authorisation', token)
      } else if (code) {
        await loginCallback(code)
      }
      refreshUser();
      refreshLanguage();
      return router.push('/');
    })();
  }, []);

  return null;
};
