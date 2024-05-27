'use client'
import { useEffect, useState } from 'react';
import s from './CreateTeam.module.css'
import { useUser } from '@/context/User';
import { Banner } from '@/ui/Banner';
import { GeistButton, GeistButtonTypes } from '@/ui/Button';
import { _server } from '@/dto/master';
import { redirect, useRouter } from 'next/navigation';
import { TitleInput } from './components/TitleInput';
import { IndentInput } from './components/IndentInput';
import { LogoInput } from './components/LogoInput';
import { useMessage } from '@/context/Message';
import { useLanguage } from '@/context/Language';
import { AuthGuard } from '@/dto/AuthGuard';

export default function CreateTeam() {
  const [ team, setTeam ] = useState(null);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string>();
  const { user } = useUser();
  const { lang } = useLanguage();
  const { destroyBanner } = useMessage();
  const router = useRouter();

  AuthGuard(user);

  const footer = {
    right: [<GeistButton options={{
      type: GeistButtonTypes.Button,
      do: !!(team && team.indent && team.title) ? send : () => {},
      text: !loading && lang.create.team,
      focused: !!(team && team.indent && team.title),
      style: [!(team && team.indent && team.title) && s.disactive],
      img: loading && 'https://cdn.impactium.fun/ui/action/redo.svg'
    }} />]
  }

  const handle = (obj) => {
    setTeam(team => {
      return { ...team, ...obj }
    })
  }

  async function send() {
    setLoading(true);
    await fetch(_server() + `/api/team/create/${team.indent}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: team.title
      })
    }).then(response => {
      if (response.ok) {
        response.json().then(async () => {
          if (team.banner) {
            await setBanner()
          } else {
            router.push(`/team/${team.indent}`);
            destroyBanner();
          }
        });
      } else {
        throw response;
      }
    }).catch(async _ => {
      const error = await _.json();
      setError(lang.error[error.message] || error.message);
    }).finally(() => {
      setLoading(false);
    });
  }

  async function setBanner() {
    setLoading(true);
    const formData = new FormData();
    formData.append('banner', team.banner);

    fetch(_server() + `/api/team/set/banner/${team.indent}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': team.banner.type
      },
      body: formData
    }).then(response => {
      if (response.ok) {
        response.json().then(team => {
          router.push(`/team/${team.indent}`);
          destroyBanner();
        });
      } else {
        throw response;
      }
    }).catch(async _ => {
      const error = await _.json()
      setError(lang.error[error.message]);
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
