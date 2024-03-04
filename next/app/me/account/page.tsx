import { Metadata } from "next";
import s from '@/styles/me/Account.module.css'
import { PlayerCredentials } from '@/components/me/account/PlayerCredentials'
import { PersonalizationPanel } from '@/components/me/account/PersonalizationPanel'
import { AchievementsModule } from '@/components/me/account/AchievementsModule'
import { ServerInfo } from '@/components/me/account/ServerInfo'
import { Overlay } from '@/components/me/Overlay'

export const metadata: Metadata = {
  title: 'Account',
};

export default function AccountPage() {
  return (
    <div className={s.account}>
      <div className={s.line}>
        <PlayerCredentials />
        <div className={s.controls}>
          <PersonalizationPanel type='nickname' />
          <PersonalizationPanel type='password' />
          <PersonalizationPanel type='skin' />
          <AchievementsModule />
        </div>  
      </div>
      <div className={s.line}>
        <ServerInfo />
      </div>
      <Overlay />
    </div>
  );
};