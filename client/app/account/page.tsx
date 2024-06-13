import { PanelTemplate } from "@/components/main/PanelTempate";
import s from './Account.module.css'
import { Avatar } from "./components/Avatar";
import { DisplayName } from "./components/DisplayName";
import { Username } from "./components/Username";
import { Email } from "./components/Email";
import { Connections } from "./components/Connections";
import { AuthGuardClientSide } from "@/components/AuthGuardClientSide";
import { _server } from "@/dto/master";
import { cookies } from "next/headers";
import { Login } from "@/dto/Login";
import Link from "next/link";
import { Nav } from "./components/Nav";
import { Balance } from "./components/Balance";

export default async function AccountPage() {
  const token = cookies().get('Authorization')?.value;

  const logins = token && await get('/api/user/logins', {
    method: 'GET',
    headers: {
      token
    }
  }) as Login[];

  return (
    <PanelTemplate style={[s.page]} title='$_account'>
      <AuthGuardClientSide />
      <Nav />
      <div className={s.wrapper}>
        <div className={s.group}>
          <Avatar />
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