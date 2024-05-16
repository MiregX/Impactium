'use client'
import s from './Team.module.css'
import { PanelTemplate } from "@/components/main/PanelTempate";
import { Comments } from "@/components/team/Comments";
import { useTeam } from "@/context/Team"
import { useState } from 'react';
import { Heading } from './components/Heading';
import { useLanguage } from '@/context/Language';
import { Description } from './components/Description';
import { Members } from './components/Members';

export default function TeamIndentPage() {
  const [ isEditable, setIsEditable ] = useState<boolean>(false);

  const toggleEditable = () => {
    setIsEditable(!isEditable);
  }
  
  return (
    <PanelTemplate style={[s.page]}>
      <div className={s.wrapper}>
        <Heading isEditable={isEditable} toggleEditable={toggleEditable} />
        <Description isEditable={isEditable} />
        <Members />
      </div>
      <Comments />
    </PanelTemplate>
  );
}
