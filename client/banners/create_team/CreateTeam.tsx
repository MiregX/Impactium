'use client'
import { useState } from 'react';
import s from './CreateTeam.module.css'
import { useUser } from '@/context/User';
import { Banner } from '@/ui/Banner';
import { GeistButton, GeistButtonTypes } from '@/ui/GeistButton';
import { _server } from '@/dto/master';
import { redirect, useRouter } from 'next/navigation';
import { TitleInput } from './components/TitleInput';
import { IndentInput } from './components/IndentInput';
import { LogoInput } from './components/LogoInput';
import { useMessage } from '@/context/Message';
import { useLanguage } from '@/context/Language';
import { AuthGuard } from '@/dto/AuthGuard';

export default function CreateTeam() {
  const [team, setTeam] = useState(null);
  const { user } = useUser();
  const { lang } = useLanguage();
  const { destroyBanner } = useMessage();
  const [ error, setError ] = useState<string>();
  const router = useRouter();

  AuthGuard(user);

  const footer = {
    right: [<GeistButton options={{
      type: GeistButtonTypes.Button,
      do: !!(team && team.indent && team.title) ? send : () => {},
      text: lang.create.team,
      focused: !!(team && team.indent && team.title),
      style: [!(team && team.indent && team.title) && s.disactive]
    }} />]
  }

  const handle = (obj) => {
    setTeam(_team => {
      return Object.assign({}, _team, obj)
    })
  }

  function send() {
    const formData = new FormData();
    formData.append('banner', team.banner);
    formData.append('title', team.title);
  
    fetch(_server() + `/api/team/create/${team.indent}`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    }).then(response => {
      if (response.ok) {
        response.json().then(team => {
          router.push(`/team/${team.indent}`);
        });
      } else {
        throw response;
      }
    }).catch(async _ => {
      const error = await _.json()
      setError(lang[error.message]);
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
