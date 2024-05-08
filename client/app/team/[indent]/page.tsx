'use client'
import s from './Team.module.css'
import { PanelTemplate } from "@/components/main/PanelTempate";
import { Comments } from "@/components/team/Comments";
import { useTeam } from "@/context/Team"
import { useState } from 'react';
import { Heading } from './components/Heading';
import { useLanguage } from '@/context/Language';
import { Description } from './components/Description';

export default function TeamIndentPage() {
  const { team } = useTeam();
  const { lang } = useLanguage();
  const [ isEditable, setIsEditable ] = useState<boolean>(false);

  const toggleEditable = () => {
    setIsEditable(!isEditable);
  }
  
  return (
    <PanelTemplate>
      <div className={s.wrapper}>
        <Heading toggleEditable={toggleEditable} />
        <Description isEditable={setIsEditable} />
      </div>
      <Comments />
    </PanelTemplate>
  );
}
