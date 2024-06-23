'use client'
import { useEffect, useState } from 'react';
import s from './CreateTournament.module.css'
import { useUser } from '@/context/User';
import { Banner } from '@/ui/Banner';
import { Button, ButtonTypes } from '@/ui/Button';
import { _server } from '@/dto/master';
import { useRouter } from 'next/navigation';
import { useApplication } from '@/context/Application';
import { useLanguage } from '@/context/Language';
import { AuthGuard } from '@/dto/AuthGuard';
import { LoginBanner } from '../login/LoginBanner';
import { VerifiedGuard } from '@/dto/VerifiedGuard';
import Image from 'next/image'

export default function CreateTeam() {
  const [ team, setTeam ] = useState(null);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string>();
  const { user } = useUser();
  const { lang } = useLanguage();
  const { destroyBanner, spawnBanner } = useApplication();
  const router = useRouter();

  !AuthGuard(user, {
    useRedirect: false
  }) && spawnBanner(<LoginBanner />);

  // VerifiedGuard(user, {
  //   useRedirect: false
  // });

  return (
    <Banner title={lang.create.tournament} options={{ center: true }}footer={{right: [
      <Button options={{
      type: ButtonTypes.Button,
      text: lang.tournament.well,
      focused: true,
    }} />
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
