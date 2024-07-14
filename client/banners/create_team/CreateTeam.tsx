'use client'
import { useState } from 'react';
import { Identifier } from '@impactium/pattern'
import { useUser } from '@/context/User.context';
import { Button } from '@/ui/Button';
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
import { Banner } from '@/ui/Banner';
import { ResponseError } from '@/dto/Response.dto';

export default function CreateTeam() {
  const [ team, setTeam ] = useState<Team>({} as Team);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string>();
  const { lang } = useLanguage();
  const { destroyBanner, spawnBanner } = useApplication();
  const router = useRouter();

  !authGuard({
    useRedirect: true
  }) && spawnBanner(<LoginBanner />);

  const footer = {
    right: [
      <Button
        onClick={send}
        loading={loading}
        variant={(Identifier.test(team?.indent) && team.title?.length >= 5 ? 'default' : 'disabled')}>{lang.create.team}</Button>]
  }

  const handle = (obj: Team) => {
    setTeam(team => {
      return { ...team, ...obj }
    })
  }

  async function send() {
    if (!Identifier.test(team?.indent) || !(team.title?.length >= 5)) return;
    setLoading(true);
    await api<Team>(`/team/create/${team.indent}`, {
      method: 'POST',
      raw: true,
      body: JSON.stringify({
        title: team.title
      })
    }).then(async res => {
      if (res.isSuccess()) {
        if (res.data.logo) {
          await setBanner()
        } else {
          router.push(`/team/${team?.indent}`);
          destroyBanner();
        }
      } else {
        const _res: ResponseError = res
        setError(_res.data.message)
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
    }).then(team => {
      router.push(`/team/${team!.indent}`);
      destroyBanner();
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <Banner title={lang.create.team} footer={footer}>
      <TitleInput key={1} team={team} handle={handle} />
      <IndentInput key={2} team={team} error={error} setTeam={setTeam} />
      <LogoInput key={3} team={team} handle={handle} />
    </Banner>
  );
};
