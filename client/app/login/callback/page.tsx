'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/context/User';
import { useLanguage } from '@/context/Language';
import { useCallback, useEffect } from 'react';
import { getServerLink } from '@/dto/master';

export default function CallbackPage() {
  const { token, setToken, refreshUser, user, setIsUserLoaded } = useUser();
  const { refreshLanguage } = useLanguage();
  const router = useRouter(); 
  const searchParams = useSearchParams();

  const _token = searchParams.get('token');
  const code = searchParams.get('code');
  
  async function loginCallback(code: string, referal?: string) {
    await fetch(`${getServerLink()}/api/oauth2/callback/discord?code=${code}${referal ? '&ref=' + referal : ''}`, {
      method: 'POST',
      credentials: 'include'
    });
  }

  useEffect(() => {
    if (!code) {
      setIsUserLoaded(false);
      if (!token) {
        setToken(_token);
      }
      return router.push('/');
    }

    loginCallback(code).then(async () => {
      await refreshUser();
      refreshLanguage();
      router.push('/');
    });
  }, []);

  return null;
};
