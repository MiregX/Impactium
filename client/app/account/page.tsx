import { PersonalAvatar } from "./components/PersonalAvatar";
import { PanelTemplate } from "@/components/PanelTempate";
import { DisplayName } from "./components/DisplayName";
import { Connections } from "./components/Connections";
import { Username } from "./components/Username";
import { Balance } from "./components/Balance";
import { Email } from "./components/Email";
import { Nav } from "./components/Nav";
import s from './Account.module.css';
import { Overview } from "./components/Overview";

export default async function AccountPage() {
  return (
    <PanelTemplate className={[s.page]} title='$_account' useAuthGuard={true}>
      <Nav />
      <div className={s.wrapper}>
        <Overview />
        <div className={s.group}>
          <PersonalAvatar />
          <Balance />
        </div>
        <DisplayName />
        <Username />
        <Email />
        <Connections />
      </div>
    </PanelTemplate>
  );
};
