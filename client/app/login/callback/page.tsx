'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/context/User';
import { useLanguage } from '@/context/Language';
import { ReactNode, Suspense, useEffect } from 'react';
import { _server } from '@/dto/master';
import Cookies from 'universal-cookie';

function CallbackComponent() {
  const { refreshUser, setIsUserLoaded } = useUser();
  const { refreshLanguage } = useLanguage();
  const cookies = new Cookies();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const code = searchParams.get('code');
  
  async function loginCallback(code: string, referal?: string) {
    await fetch(`${_server()}/api/oauth2/${cookies.get('login_method').toLowerCase()}/callback?code=${code}${referal ? '&ref=' + referal : ''}`, {
      method: 'POST',
      credentials: 'include'
    });
  }

  useEffect(() => {
    setIsUserLoaded(false);
    (async () => {
      if (token) {
        cookies.set('Authorization', token)
      } else if (code) {
        await loginCallback(code);
      }
      refreshUser();
      refreshLanguage();
    })();
  }, []);

  router.push('/');
  return null
};

export default function CallbackPage() {
  return <CallbackComponent />
}
