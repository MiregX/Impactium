'use client'
import { useEffect, useState } from 'react';
import s from './CreateTeam.module.css'
import { CreateTeamDto } from '@api/main/team/addon/team.dto'
import { useUser } from '@/context/User';
import { Banner } from '@/ui/Banner';
import { GeistButtonTypes } from '@/ui/GeistButton';
import { _server } from '@/dto/master';
import { redirect, useRouter } from 'next/navigation';
import { TitleInput } from './components/TitleInput';
import { IndentInput } from './components/IndentInput';
import { LogoInput } from './components/LogoInput';
import { useMessage } from '@/context/Message';
import { useLanguage } from '@/context/Language';

export default function CreateTeam() {
  const [team, setTeam] = useState<CreateTeamDto>(null);
  const { user } = useUser();
  const { lang } = useLanguage();
  const { destroyBanner } = useMessage();
  const [ footer, setFooter ] = useState<any>();
  const [ error, setError ] = useState<string>();
  const router = useRouter();

  if (!user) {
    destroyBanner()
  }

  useEffect(() => {
    const fulfilled = !!(team && team.banner && team.indent && team.title) 
    setFooter({
      right: [{
        type: GeistButtonTypes.Button,
        action: fulfilled ? send : () => {},
        text: lang._create_team,
        focused: fulfilled,
        style: [!fulfilled && s.disactive]
      }]
    })
  }, [team])

  const handle = (obj: Partial<CreateTeamDto>) => {
    setTeam(_team => {
      return Object.assign({}, _team, obj)
    })
  }

  function send() {
    const formData = new FormData();
    formData.append('banner', team.banner);
    formData.append('title', team.title);
    formData.append('indent', team.indent);
  
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
    <Banner title={lang._create_team} footer={footer}>
      <TitleInput team={team} handle={handle} />
      <IndentInput team={team} error={error} setTeam={setTeam} />
      <LogoInput team={team} handle={handle} />
    </Banner>
  );
};
