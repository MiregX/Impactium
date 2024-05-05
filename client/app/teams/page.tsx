import { GeistButton, GeistButtonTypes } from '@/ui/GeistButton';
import s from './Teams.module.css'
import { PanelTemplate } from '@/components/main/PanelTempate';
import { _server } from '@/dto/master';

export default async function TeamsPage() {

  const teams = await fetch(_server() + '/api/teams/get/all', {
    next: {
      revalidate: 60
    }
  })
    .then(async (res) => {
      return await res.json();
    });

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
        <GeistButton options={{
          type: GeistButtonTypes.Link,
          href: '/team/create',
          text: 'Создать команду',
          focused: true,
          style: [ s.button ]
        }} />
      </div>
      <div className={s.recomendations}>
        <h4>Рекомендации</h4>
        <div className={s.list}>
          
        </div>
      </div>
    </PanelTemplate>
  );
} 