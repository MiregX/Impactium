'use client'
import { useEffect, useState } from 'react';
import s from './CreateTeam.module.css'
import { useUser } from '@/context/User.context';
import { Banner } from '@/ui/Banner';
import { Button, ButtonTypes } from '@/ui/Button';
import { redirect, useRouter } from 'next/navigation';
import { TitleInput } from './components/TitleInput';
import { IndentInput } from './components/IndentInput';
import { LogoInput } from './components/LogoInput';
import { useApplication } from '@/context/Application.context';
import { useLanguage } from '@/context/Language.context';
import { authGuard } from '@/decorator/authGuard';
import { LoginBanner } from '../login/LoginBanner';
import { _server } from '@/decorator/api';
import { Team } from '@/dto/Team';

export default function CreateTeam() {
  const [ team, setTeam ] = useState<Team>({} as Team);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string>();
  const { user } = useUser();
  const { lang } = useLanguage();
  const { destroyBanner, spawnBanner } = useApplication();
  const router = useRouter();

  !authGuard({
    useRedirect: true
  }) && spawnBanner(<LoginBanner />);

  const footer = {
    right: [<Button options={{
      type: ButtonTypes.Button,
      do: !!(team?.indent && team.title?.length >= 5) ? send : () => {},
      text: lang.create.team,
      focused: !!(team?.indent && team.title?.length >= 5),
      className: !(team?.indent && team.title?.length >= 5) && s.disactive
    }} />]
  }

  const handle = (obj: Team) => {
    setTeam(team => {
      return { ...team, ...obj }
    })
  }

  async function send() {
    setLoading(true);
    await api<Team>(`/team/create/${team.indent}`, {
      method: 'POST',
      body: JSON.stringify({
        title: team.title
      })
    }).then(async team => {
      if (team?.logo) {
        await setBanner()
      } else {
        router.push(`/team/${team?.indent}`);
        destroyBanner();
      }
    }).finally(() => {
      setLoading(false);
    });
  }

  async function setBanner() {
    setLoading(true);
    const formData = new FormData();
    formData.append('banner', team.logo || new Blob);

    api<Team>(`/team/set/banner/${team.indent}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/*'
      },
      body: formData
    }).then(res => {
      router.push(`/team/${team.indent}`);
      destroyBanner();
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <Banner title={lang.create.team} footer={footer}>
      <TitleInput team={team} handle={handle} />
      <IndentInput team={team} error={error} setTeam={setTeam} />
      <LogoInput team={team} handle={handle} />
    </Banner>
  );
};
