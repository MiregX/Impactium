'use client'
import { Joinable, JoinableIcons } from '@/dto/Joinable.dto';
import { Team, λTeam } from '@/dto/Team.dto';
import { Banner } from '@/ui/Banner';
import { Icon } from '@/ui/Icon';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/Select';
import { ChangeEvent, useEffect, useState } from 'react';
import s from './Manager.module.css';
import { Separator } from '@/ui/Separator';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Combination } from '@/ui/Combitation';
import { DisplayName, Identifier } from '@impactium/pattern';
import { useLanguage } from '@/context/Language.context';
import { toast } from 'sonner';
import { SetState } from '@/lib/utils';
import { useApplication } from '@/context/Application.context';
import { useUser } from '@/context/User.context';
import { useRouter } from 'next/navigation';

interface ManageTeamBannerProps {
  team?: Team;
  setTeam?: SetState<Team>
}

export function ManageTeamBanner({ team, setTeam }: ManageTeamBannerProps) {
  const isCreate = !team;
  const { destroyBanner } = useApplication();
  const { lang } = useLanguage();
  const { refreshUser } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [indent, setIndent] = useState<Team['indent']>(isCreate ? '' : team.indent);
  const [indentValid, setIndentValid] = useState<boolean>(true);
  const router = useRouter();
  
  const [title, setTitle] = useState<Team['title']>(isCreate ? '' : team.title);
  const [titleValid, setTitleValid] = useState<boolean>(true);

  const [joinable, setJoinable] = useState<Team['joinable']>(isCreate ? Joinable.Invites : team.joinable);
  const [logo, setLogo] = useState<Team['logo']>(isCreate ? '' : team.logo);
  const [rawLogo, setRawLogo] = useState<File | undefined>();

  const save = () => {
    if (!Identifier.test(indent)) {
      setIndentValid(false);
      return toast(lang.error.indent_invalid_format);
    }
    if (!DisplayName.test(title)) {
      setTitleValid(false);
      return toast(lang.error.display_name_invalid_format);
    }

    const path = isCreate
      ? `/team/create`
      : `/team/${team.indent}/edit`

    const method = isCreate
      ? 'POST'
      : 'PATCH'

    api<Team>(path, {
      method,
      body: λTeam.create({
        indent,
        title,
        joinable,
        rawLogo,
      }),
      toast: true,
      setLoading
    }, setTeam).then(async team => {
      if (!team) return;

      await refreshUser();

      if (typeof window !== 'undefined') {
        console.log('Current: ', window.history.state)
        window.history.pushState(null, '', `/team/@${team.indent}`);
        router.push(`/team/@${team.indent}`);
      }

      destroyBanner();
    });
  }

  const indentInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setIndentValid(true);
    setIndent(event.target.value)
  };

  const titleInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitleValid(true);
    setTitle(event.target.value)
  };

  const logoInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setRawLogo(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!rawLogo) return;

    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(rawLogo);
  }, [rawLogo]);

  return (
    <Banner title={isCreate ? 'Create team' : 'Edit team'}>
      <Combination size='heading' id={indent || 'example_id'} src={logo} name={title || 'Example Title'} />
      <Separator />
      <div className={s.node}>
        <p>Название команды*</p>
        <Input valid={titleValid} value={title} onChange={titleInputHandler} img='Quote' placeholder='Название команды' />
      </div>
      <div className={s.node}>
        <p>Айди команды*</p>
        <Input valid={indentValid} img='AtSign' value={indent} onChange={indentInputHandler} placeholder='Айди команды' />
      </div>
      <div className={s.node}>
        <p>Логотип команды</p>
        <Input img='ImageUp' onChange={logoInputHandler} type='file' accept='.png, .jpg, .jpeg, .svg, .webm' />
      </div>
      <div className={s.node}>
        <p>Тип присоединения к команде</p>
        <Select onValueChange={(joinable) => setJoinable(joinable as Joinable)} value={joinable}>
          <SelectTrigger className={s.joinable} value={joinable}><Icon name={JoinableIcons[joinable]} />{lang.joinable[joinable]}</SelectTrigger>
          <SelectContent>
            {Object.values(Joinable).map(value => (
              <SelectItem key={value} value={Joinable[value]}>
                <Icon name={JoinableIcons[value]} />{lang.joinable[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div className={s.node}>
        <span>Обязательные поля помечены звёздочкой</span>
        <Button loading={loading} onClick={save} img='Bookmark'>Сохранить</Button>
      </div>
    </Banner>
  )
}