'use client'
import { useEffect, useState } from 'react';
import s from './CreateTeam.module.css'
import { CreateTeamDto } from '@api/main/team/team.dto'
import { useUser } from '@/context/User';
import { Banner } from '@/ui/Banner';
import { GeistButtonTypes } from '@/ui/GeistButton';
import { _server } from '@/dto/master';
import { redirect } from 'next/navigation';
import { TitleInput } from './components/TitleInput';
import { IndentInput } from './components/IndentInput';
import { LogoInput } from './components/LogoInput';
import { useMessage } from '@/context/Message';

export default function CreateTeam() {
  const [team, setTeam] = useState<CreateTeamDto>(null);
  const { user } = useUser();
  const { destroyBanner } = useMessage();
  const [footer, setFooter] = useState<any>();

  if (!user) {
    destroyBanner()
  }

  useEffect(() => {
    setFooter({
      right: [{
        type: GeistButtonTypes.Button,
        action: send,
        text: 'Создать команду',
        focused: !!(team && team.banner && team.indent && team.title),
        style: [!(team && team.banner && team.indent && team.title) && s.disactive]
      }]
    })
  }, [team])

  const handle = (obj: Partial<CreateTeamDto>) => {
    setTeam(_team => {
      return Object.assign({}, _team, obj)
    })
  }

  const handleError = (_: any) => {
    console.log(_);
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
          'use client'
          redirect(`/team/${team.indent}`);
        });
      }
    }).catch(_ => {
      handleError(_);
    });
  }



  return (
    <Banner title='Создать команду' footer={footer}>
      <TitleInput team={team} handle={handle} />
      <IndentInput team={team} setTeam={setTeam} />
      <LogoInput team={team} handle={handle} />
    </Banner>
  );
};
