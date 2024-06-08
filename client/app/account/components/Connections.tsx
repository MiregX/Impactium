'use client'
import { useLanguage } from "@/context/Language";
import { useUser } from "@/context/User";
import { Card } from "@/ui/Card";
import s from '../Account.module.css';
import { Login } from "@/dto/Login";
import { GeistButton, GeistButtonTypes } from "@/ui/Button";
import { LoginBanner } from "@/banners/login/LoginBanner";
import { useMessage } from "@/context/Message";

export function Connections({ logins }: { logins: Login[] }) {
  const { lang } = useLanguage();
  const { user } = useUser();
  const { spawnBanner } = useMessage();

  const button = <GeistButton options={{
    type: GeistButtonTypes.Button,
    text: lang.account.connect,
    do: () => spawnBanner(<LoginBanner />),
    img: 'https://cdn.impactium.fun/ui/action/add-plus.svg',
    focused: true
  }} />

  return (
    <Card className={s.account} id='connections' description={{
      text: lang.account.connections_description,
      button
      }}>
      <h6>{lang.account.connections}</h6>
      <p>{lang.account.connections_content}</p>
      <section>
        {logins.map((login, index) => <Unit key={index} login={login} /> )}
      </section>
    </Card>
  );
  
};

function Unit({ login }: { login: Login }) {
  return (
    <div className={s.unit}>
      <img src={`https://cdn.impactium.fun/tech/${login.type}.png`} />
      {login.avatar && <img src={login.avatar} />}
      <p>{login.displayName}</p>
      <code>
        <img src='https://cdn.impactium.fun/ui/specific/command.svg' />{login.id}
      </code>
    </div>
  );
}