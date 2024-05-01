'use client'
import { GeistButton, GeistButtonTypes } from '@/ui/GeistButton';
import s from './Teams.module.css'
import { PanelTemplate } from '@/components/main/PanelTempate';

export default function TeamsPage() {
  return (
    <PanelTemplate style={[s.wrapper]} >
      <div className={s.bar}>
        <div className={s.search}>
          <span>
            <img src='https://cdn.impactium.fun/ui/action/search.svg' />
          </span>
          <input
            placeholder="Введи название команды или её тег..."
            aria-label="Search"
            aria-invalid="false"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            type="search" 
            name='q' />
        </div>
        <GeistButton options={{
          type: GeistButtonTypes.Button,
          action: () => {

          },
          text: 'Создать команду',
          focused: true,
          style: []
        }} />
      </div>
    </PanelTemplate>
  );
} 