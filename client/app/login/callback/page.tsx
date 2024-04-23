'use client'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@/context/User';
import { useLanguage } from '@/context/Language';
import { Suspense, useEffect } from 'react';
import { getServerLink } from '@/dto/master';
import Cookies from 'universal-cookie';

function CallbackComponent() {
  const { refreshUser, setIsUserLoaded } = useUser();
  const { refreshLanguage } = useLanguage();
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
    })();
  }, []);

  return null;
};

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackComponent />
    </Suspense>
  );
}
