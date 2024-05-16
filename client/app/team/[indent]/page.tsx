'use client'
import s from './Team.module.css'
import { PanelTemplate } from "@/components/main/PanelTempate";
import { Comments } from "@/components/team/Comments";
import { Heading } from './components/Heading';
import { Description } from './components/Description';
import { Members } from './components/Members';

export default function TeamIndentPage() {
  
  return (
    <PanelTemplate style={[s.page]}>
      <div className={s.wrapper}>
        <Heading />
        <Description />
        <Members />
      </div>
      <Comments />
    </PanelTemplate>
  );
}
