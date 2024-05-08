'use client'
import { useEffect, useState } from 'react';
import s from './CreateTeam.module.css'
import { CreateTeamDto } from '@api/main/team/team.dto'
import { useUser } from '@/context/User';
import { Banner } from '@/ui/Banner';
import { GeistButton, GeistButtonTypes } from '@/ui/GeistButton';
import { _server } from '@/dto/master';
import { useRouter } from 'next/router';
import { Input } from '@/ui/Input';
import { redirect } from 'next/navigation';
import Error from 'next/error';

export default function CreateTeam() {
  const [team, setTeam] = useState<CreateTeamDto>(null);
  const { user } = useUser();
  const [bannerPreview, setBannerPreview] = useState<any>();
  const [footer, setFooter] = useState<any>();

  useEffect(() => {
    setFooter({
      right: [{
        type: GeistButtonTypes.Button,
        action: send,
        text: 'Создать команду',
        focused: !!(team && team.banner && team.indent && team.title),
      }]
    })
  }, [team])

  if (!user) {
    redirect('/')
  }

  const handle = (obj: Partial<CreateTeamDto>) => {
    setTeam(_team => {
      return Object.assign({}, _team, obj)
    })
  }

  function handleError(_: Error) {
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
          redirect(`/team/${team.indent}`) // Error: NEXT_REDIRECT
        });
      }
    }).catch(_ => {
      handleError(_);
    });
  }

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    handle({banner: file});
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Banner title='Создать команду' footer={footer}>
      <div className={s.group}>
        <p>Название команды</p>
        <Input
          type="text"
          image='https://cdn.impactium.fun/ui/text/paragraph.svg'
          placeholder='Название команды'
          value={team?.title || ''}
          onChange={(e) => handle({ title: e.target.value })}
          style={[s.input]}
        />
      </div>
      <div className={s.group}>
        <p>Тег команды</p>
        <Input
          placeholder='example'
          image='https://cdn.impactium.fun/ui/specific/mention.svg'
          value={team?.indent || ''}
          onChange={(e) => setTeam(t => {
            return {
              ...t,
              indent: e.target.value.match(/^[0-1a-z_\-]+$/) || e.target.value === '' ? e.target.value : t.indent
            };
          })}
          style={[s.input]}
        />
      </div>
      <div className={`${s.group} ${s.banner_uploader}`}>
        <p>Логотип команды</p>
        <div className={s.bottom}>
          <Input
            type="file"
            label='file'
            accept="image/*"
            onChange={handleBannerChange}
            placeholder={`Загрузить логотип в формате PNG, SVG, JPG (1 к 1)`}
            />
          {bannerPreview && <div className={s.banner_preview}>
            <img src={bannerPreview} />
          </div>}
        </div>
      </div>
    </Banner>
  );
};
