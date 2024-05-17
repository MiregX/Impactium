'use client'
import s from './Teams.module.css'
import { PanelTemplate } from '@/components/main/PanelTempate';
import { _server } from '@/dto/master';
import { TeamUnit } from './components/TeamUnit';
import { GeistButton, GeistButtonTypes } from '@/ui/GeistButton';
import { useLanguage } from '@/context/Language';
import { useEffect, useState } from 'react';
import CreateTeam from '@/banners/create_team/CreateTeam';
import { useMessage } from '@/context/Message';

export default function TeamsPage({ data }) {
  const { lang } = useLanguage();
  const { spawnBanner } = useMessage();
  const [ teams, setTeams ] = useState(data);

  useEffect(() => {
    if (data) return;
    (async () => {
      setTeams(await fetch(`${_server()}/api/team/get`, {
        method: 'GET',
        cache: 'no-cache'
      })
      .then(async (res) => {
        return await res.json();
      })
      .catch(_ => {
        return undefined;
      }));
    })();
  }, []);

  return (
    <PanelTemplate style={[s.wrapper]} >
      <div className={s.bar}>
        <div className={s.search}>
          <span>
            <img src='https://cdn.impactium.fun/ui/specific/mention.svg' />
          </span>
          <input
            placeholder={lang.team.enter_indent_or_title}
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
          do: () => spawnBanner(<CreateTeam />),
          text: lang.create.team,
          focused: true,
          style: [ s.button ]
        }} />
      </div>
      <div className={s.recomendations}>
        <h4>Рекомендации</h4>
        <div className={s.list}>
          {teams && teams.map((team) => {
            return (
              <TeamUnit key={team.indent} team={team} />
            )
          })}
        </div>
      </div>
    </PanelTemplate>
  );
} 