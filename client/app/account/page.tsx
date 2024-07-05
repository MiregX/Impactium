import { PersonalAvatar } from "./components/PersonalAvatar";
import { PanelTemplate } from "@/components/PanelTempate";
import { DisplayName } from "./components/DisplayName";
import { Connections } from "./components/Connections";
import { Username } from "./components/Username";
import { Balance } from "./components/Balance";
import { Email } from "./components/Email";
import { Nav } from "./components/Nav";
import { Login } from "@/dto/Login";
import s from './Account.module.css';

export default async function AccountPage() {
  const logins = await api<Login[]>('/user/logins') || [];

  return (
    <PanelTemplate className={[s.page]} title='$_account' useAuthGuard={true}>
      <Nav />
      <div className={s.wrapper}>
        <div className={s.group}>
          <PersonalAvatar />
          <Balance />
        </div>
        <DisplayName />
        <Username />
        <Email />
        <Connections logins={logins} />
      </div>
    </PanelTemplate>
  );
};
