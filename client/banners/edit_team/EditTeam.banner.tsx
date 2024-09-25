'use client'
import { Joinable, JoinableIcons } from "@/dto/Joinable.dto";
import { Team } from "@/dto/Team";
import { Banner } from "@/ui/Banner";
import { Icon } from "@/ui/Icon";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/ui/Select";
import { ChangeEvent, useRef, useState } from "react";
import s from './EditTeamBanner.module.css';
import { Separator } from "@/ui/Separator";
import { Button } from "@/ui/Button";
import { EditTeamRequest } from "@/dto/EditTeamBody.request";
import { Input } from "@/ui/Input";
import { Combination } from "@/ui/Combitation";
import { DisplayName, Identifier } from "@impactium/pattern";
import { SetState } from "@/lib/utils";
import { λthrow } from "@impactium/utils";
import { useLanguage } from "@/context/Language.context";

interface EditTeamBannerProps {
  team: Team;
}

export function EditTeamBanner({ team }: EditTeamBannerProps) {
  const { lang } = useLanguage();
  const [indent, setIndent] = useState<Team['indent']>(team.indent);
  const indentInput = useRef<HTMLInputElement>(null);
  const [indentError, setIndentError] = useState<string | null>(null);
  
  const [title, setTitle] = useState<Team['title']>(team.title);
  const titleInput = useRef<HTMLInputElement>(null);
  const [titleError, setTitleError] = useState<string | null>(null);

  const [joinable, setJoinable] = useState<Team['joinable']>(team.joinable);
  const [logo, setLogo] = useState<Team['logo']>(team.logo);

  const save = () => {
    if (!Identifier.test(indent)) {
      indentInput.current?.classList.add(s.invalid);
      return setIndentError(lang.error.indent_invalid_format);
    }
    if (!DisplayName.test(title)) {
      titleInput.current?.classList.add(s.invalid);
      return setTitleError(lang.error.displayName_invalid_format);
    }

    api<Team>(`/team/${team.indent}/edit`, {
      method: 'PATCH',
      body: EditTeamRequest.create({
        indent,
        title,
        joinable,
        logo,
      }),
      raw: true
    }).then(response => {
      console.log(response);
    })
  }

  const indentInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    indentInput.current?.classList.remove(s.invalid);
    setIndent(event.target.value)
  };

  const titleInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    titleInput.current?.classList.remove(s.invalid);
    setTitle(event.target.value)
  };

  const logoInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Banner title='Edit team'>
      <div className={s.preview}>
        <Combination size='heading' id={indent || 'example_id'} src={logo} name={title || 'Example Title'} />
      </div>
      <Separator />
      <div className={s.node}>
        <p>Название команды*</p>
        <Input ref={titleInput} value={title} onChange={titleInputHandler} img='Quote' placeholder='Название команды' />
      </div>
      <div className={s.node}>
        <p>Айди команды*</p>
        <Input ref={indentInput} img='AtSign' value={indent} onChange={indentInputHandler} placeholder='Айди команды' />
      </div>
      <div className={s.node}>
        <p>Логотип команды</p>
        <Input img='ImageUp' onChange={logoInputHandler} type='file' accept='.png, .jpg, .jpeg, .svg, .webm' />
      </div>
      <div className={s.node}>
        <p>Тип присоединения к команде</p>
        <Select onValueChange={(joinable) => setJoinable(joinable as Joinable)}>
          <SelectTrigger className={s.joinable} value={joinable}><Icon name={JoinableIcons[joinable]} />{joinable}</SelectTrigger>
          <SelectContent>
            {Object.values(Joinable).map(value => <SelectItem value={Joinable[value]}><Icon name={JoinableIcons[value]} />{Joinable[value]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div className={s.node}>
        <span>Обязательные поля помечены звёздочкой</span>
        <Button onClick={save} img='Save'>Сохранить</Button>
      </div>
    </Banner>
  )
}