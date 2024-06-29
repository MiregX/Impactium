import { PanelTemplate } from "@/components/PanelTempate";
import s from './Account.module.css'
import { PersonalAvatar } from "./components/PersonalAvatar";
import { DisplayName } from "./components/DisplayName";
import { Username } from "./components/Username";
import { Email } from "./components/Email";
import { Connections } from "./components/Connections";
import { AuthGuardClientSide } from "@/components/AuthGuardClientSide";
import { cookies } from "next/headers";
import { Login } from "@/dto/Login";
import { Nav } from "./components/Nav";
import { Balance } from "./components/Balance";

export default async function AccountPage() {
  const token = cookies().get('Authorization')?.value;

  const logins: Login[] | null = token && await api('/user/logins', {
    headers: {
      token
    }
  });

  return (
    <PanelTemplate style={[s.page]} title='$_account'>
      <AuthGuardClientSide />
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
}