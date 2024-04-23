'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/context/User';
import { useLanguage } from '@/context/Language';
import { ReactNode, Suspense, useEffect } from 'react';
import { getServerLink } from '@/dto/master';
import Cookies from 'universal-cookie';

function CallbackComponent() {
  const { refreshUser, setIsUserLoaded, login } = useUser();
  const { refreshLanguage } = useLanguage();
  const cookies = new Cookies();
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
    setIsUserLoaded(false);
    (async () => {
      if (token) {
        login(token);
      } else if (code) {
        await loginCallback(code);
        refreshUser();
      }
      refreshLanguage();
    })();
  }, []);

  router.push('/');
  return null 
};

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackComponent />
    </Suspense>
  );
}
