'use client'
import { Joinable, JoinableIcons } from "@/dto/Joinable.dto";
import { Team } from "@/dto/Team";
import { Banner } from "@/ui/Banner";
import { Icon } from "@/ui/Icon";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/ui/Select";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import s from './EditTeamBanner.module.css';
import { Separator } from "@/ui/Separator";
import { Button } from "@/ui/Button";
import { EditTeamRequest } from "@/dto/EditTeamBody.request";
import { Input } from "@/ui/Input";
import { Combination } from "@/ui/Combitation";
import { DisplayName, Identifier } from "@impactium/pattern";
import { useLanguage } from "@/context/Language.context";
import { toast } from "sonner";
import { SetState } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useApplication } from "@/context/Application.context";

interface EditTeamBannerProps {
  team: Team;
  setTeam: SetState<Team>
}

export function EditTeamBanner({ team, setTeam }: EditTeamBannerProps) {
  const { destroyBanner } = useApplication();
  const { lang } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const [indent, setIndent] = useState<Team['indent']>(team.indent);
  const [indentValid, setIndentValid] = useState<boolean>(true);
  
  const [title, setTitle] = useState<Team['title']>(team.title);
  const [titleValid, setTitleValid] = useState<boolean>(true);

  const [joinable, setJoinable] = useState<Team['joinable']>(team.joinable);
  const [logo, setLogo] = useState<Team['logo']>(team.logo);
  const [rawLogo, setRawLogo] = useState<File | undefined>();

  const save = () => {
    let error: string | number = 0;

    if (!Identifier.test(indent)) {
      setIndentValid(false);
      error = toast(lang.error.indent_invalid_format);
      
    }
    if (!DisplayName.test(title)) {
      setTitleValid(false);
      error = toast(lang.error.displayName_invalid_format);
    }

    if (error) return;

    api<Team>(`/team/${team.indent}/edit`, {
      method: 'PATCH',
      body: EditTeamRequest.create({
        indent,
        title,
        joinable,
        rawLogo,
      }),
      toast: true,
      setLoading
    }, setTeam).then(team => {
      typeof window !== 'undefined' && window.history.pushState(null, '', `/team/@${team.indent}`); 
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
    <Banner title='Edit team'>
      <div className={s.preview}>
        <Combination size='heading' id={indent || 'example_id'} src={logo} name={title || 'Example Title'} />
      </div>
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
        <Select onValueChange={(joinable) => setJoinable(joinable as Joinable)}>
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
        <Button loading={loading} onClick={save} img='Save'>Сохранить</Button>
      </div>
    </Banner>
  )
}