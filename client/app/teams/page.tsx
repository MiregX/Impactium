'use server'
// import { GeistButton, GeistButtonTypes } from '@/ui/GeistButton';
import s from './Teams.module.css'
import { PanelTemplate } from '@/components/main/PanelTempate';
import { _server } from '@/dto/master';
import { TeamEntity } from '@api/main/team/team.entity';

export default async function TeamsPage() {
  const teams: TeamEntity[] = await fetch(`http://0.0.0.0:3001/api/team/get`, {
    method: 'GET',
    cache: 'no-cache'
  })
  .then(async (res) => {
    console.log(res.body)
    return await res.json();
  })
  .catch(_ => {
    console.log(_)
    return undefined;
  });

  console.log(teams)

  return (
    <PanelTemplate style={[s.wrapper]} >
      <div className={s.bar}>
        <div className={s.search}>
          <span>
            <img src='https://cdn.impactium.fun/ui/specific/mention.svg' />
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
        {/* <GeistButton options={{
          type: GeistButtonTypes.Link,
          href: '/team/create',
          text: 'Создать команду',
          focused: true,
          style: [ s.button ]
        }} /> */}
      </div>
      <div className={s.recomendations}>
        <h4>Рекомендации</h4>
        <div className={s.list}>
          {teams && teams.map((team: TeamEntity) => {
            return (
              <p>{team.title}</p>
            )
          })}
        </div>
      </div>
    </PanelTemplate>
  );
} 