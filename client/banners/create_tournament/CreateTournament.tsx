'use client'
import { useState } from 'react';
import { useUser } from '@/context/User.context';
import { Banner } from '@/ui/Banner';
import { Button } from '@/ui/Button';
import { useRouter } from 'next/navigation';
import { useApplication } from '@/context/Application.context';
import { useLanguage } from '@/context/Language.context';
import { authGuard } from '@/decorator/authGuard';
import { LoginBanner } from '../login/LoginBanner';
import Image from 'next/image'
import { verifiedGuard } from '@/decorator/verifiedGuard';

export function CreateTournament() {
  const { lang } = useLanguage();
  const { destroyBanner, spawnBanner } = useApplication();

  !authGuard({
    useRedirect: false
  }) && spawnBanner(<LoginBanner />);

  verifiedGuard({
    useRedirect: false
  });

  return (
    <Banner title={lang.create.tournament} options={{ center: true }}footer={{right: [
      <Button onClick={destroyBanner}>{lang.tournament.well}</Button>
  ]}}>
      <Image width={92} height={92} src='https://cdn.impactium.fun/ui/wavy/check.svg' alt='Not Verified' />
      <h4 style={{
        fontSize: '18px',
        fontWeight: 300,
        textAlign: 'center',
      }}>{lang.tournament.forbidden}</h4>
    </Banner>
  );
};
