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

export default async function AccountPage() {
  const token = cookies().get('Authorization')?.value;

  const logins = token ? await fetch(`${_server()}/api/user/logins`, {
    method: 'GET',
    headers: {
      token
    }
  }).then(res => res.json()).catch(_ => null) : null;

  console.log(logins)

  return (
    <PanelTemplate style={[s.page]}>
      <AuthGuardClientSide />
      <Avatar />
      <DisplayName />
      <Username />
      <Email />
      <Connections logins={logins || [] as Login[]} />
    </PanelTemplate>
  );
}