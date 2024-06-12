import { GeistButton, GeistButtonTypes } from '@/ui/Button';
import s from './Onboarding.module.css';
import CreateTeam from '@/banners/create_team/CreateTeam';
import { useApplication } from '@/context/Application';
import { useLanguage } from '@/context/Language';

export function Text() {
  const { spawnBanner } = useApplication();
  const { lang } = useLanguage();

  return (
    <div className={s.onboard}>
      <h3>{lang.main.h3}</h3>
      <p>{lang.main.we_are}</p>
      <h4>
        <img src='https://cdn.impactium.fun/ui/user/users-group.svg'/>
        {lang.main.find_team}
      </h4>
      <p>{lang.main.find_team_description}</p>
      <div className={s.group}>
        <GeistButton options={{
          type: GeistButtonTypes.Link,
          do: '/teams',
          focused: true,
          text: lang.find.team,
          style: [ s.button ]
        }} />
        <GeistButton options={{
          type: GeistButtonTypes.Button,
          do: () => spawnBanner(<CreateTeam />),
          text: lang.create.team,
          minimized: true
        }} />
      </div>
    </div>
  )
}