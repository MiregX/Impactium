import { Button, ButtonTypes } from '@/ui/Button';
import s from './styles/Onboarding.module.css';
import CreateTeam from '@/banners/create_team/CreateTeam';
import { useApplication } from '@/context/Application.context';
import { useLanguage } from '@/context/Language.context';

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
        <Button options={{
          type: ButtonTypes.Link,
          do: '/teams',
          focused: true,
          text: lang.find.team,
          className: s.button
        }} /> 
        <Button options={{
          type: ButtonTypes.Button,
          do: () => spawnBanner(<CreateTeam />),
          text: lang.create.team,
          minimized: true
        }} />
      </div>
    </div>
  )
}