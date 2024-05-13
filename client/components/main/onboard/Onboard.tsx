import { GeistButton, GeistButtonTypes } from '@/ui/GeistButton'
import { Arcana } from './Arcana'
import s from './Onboard.module.css'
import { PanelTemplate } from '@/components/main/PanelTempate'
import CreateTeam from '@/banners/create_team/CreateTeam'
import { useMessage } from '@/context/Message'
import { useLanguage } from '@/context/Language'

export function Onboard() {
  const { spawnBanner } = useMessage();
  const { lang } = useLanguage();

  return (
    <PanelTemplate>
      <Arcana />
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
            text: lang._find_team,
            style: [ s.button ]
          }} />
          <GeistButton options={{
            type: GeistButtonTypes.Button,
            do: () => spawnBanner(<CreateTeam />),
            text: lang._create_team,
            minimized: true
          }} />
        </div>
        <h4>
          <img src='https://cdn.impactium.fun/ui/specific/ticket-voucher.svg'/>
          {lang.main.participate}
        </h4>
        <p>{lang.main.participate_description}</p>
        <div className={s.group}>
          <GeistButton options={{
            type: GeistButtonTypes.Link,
            do: '/me/actions',
            text: lang._find_team,
            style: [ s.button ]
          }} />
          <GeistButton options={{
            type: GeistButtonTypes.Link,
            do: '/me/actions',
            text: lang._create_tournament,
            minimized: true
          }} />
        </div>
      </div>
    </PanelTemplate>
  )
}