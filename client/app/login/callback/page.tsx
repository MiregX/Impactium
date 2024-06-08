'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/context/User';
import { useLanguage } from '@/context/Language';
import { ReactNode, Suspense, useEffect } from 'react';
import { _server } from '@/dto/master';
import Cookies from 'universal-cookie';

export default function CallbackPage() {
  const { refreshUser, setIsUserLoaded } = useUser();
  const { refreshLanguage } = useLanguage();
  const cookies = new Cookies();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  useEffect(() => {
    setIsUserLoaded(false);
    (async () => {
      if (token) {
        cookies.set('Authorization', token, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7
        })
      }
      refreshUser();
      refreshLanguage();
    })();
    cookies.getAll();
  }, []);

  router.push('/');
  return null
};
