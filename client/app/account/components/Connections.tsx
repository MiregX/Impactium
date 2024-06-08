'use client'
import { useLanguage } from "@/context/Language";
import { useUser } from "@/context/User";
import { Card } from "@/ui/Card";
import s from '../Account.module.css';
import { Login } from "@/dto/Login";

export function Connections({ logins }: { logins: Login[] }) {
  const { lang } = useLanguage();
  const { user } = useUser();

  console.log({} as JSX.IntrinsicElements)

  return (
    <Card className={s.account} description={lang.account.connections_description}>
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
      <code>{login.id}</code>
    </div>
  );
}