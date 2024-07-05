'use client'
import { useLanguage } from "@/context/Language.context";
import { Card } from "@/ui/Card";
import s from '../Account.module.css';
import { Login } from "@/dto/Login";
import { Button, ButtonTypes } from "@/ui/Button";
import { LoginBanner } from "@/banners/login/LoginBanner";
import { useApplication } from "@/context/Application.context";
import { Avatar } from "@/components/Avatar";

export function Connections({ logins }: { logins: Login[] | null }) {
  const { lang } = useLanguage();
  const { spawnBanner } = useApplication();

  const button = <Button options={{
    type: ButtonTypes.Button,
    text: lang.account.connect,
    do: () => spawnBanner(<LoginBanner connect={true} />),
    img: 'https://cdn.impactium.fun/ui/action/add-plus.svg',
    focused: true
  }} />

  return (
    <Card className={` ${s.account} ${s.connections}`} id='connections' description={{
      text: lang.account.connections_description,
      button
    }}>
      <h6>{lang.account.connections}</h6>
      <p>{lang.account.connections_content}</p>
      <section>
        {logins && logins.map((login, index) => <Unit key={index} login={login} /> )}
      </section>
    </Card>
  );
  
};

function Unit({ login }: { login: Login }) {
  return (
    <div className={s.unit}>
      <img src={`https://cdn.impactium.fun/tech/${login.type}.png`} />
      <Avatar
        size={32}
        src={login.avatar}
        alt={login.displayName} />
      <p>{login.displayName}</p>
      <code>
        <img src='https://cdn.impactium.fun/ui/specific/command.svg' />{login.id}
      </code>
    </div>
  );
}
