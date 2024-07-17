'use client'
import { useLanguage } from "@/context/Language.context";
import { Card } from "@/ui/Card";
import s from '../Account.module.css';
import { Login } from "@/dto/Login";
import { Button } from "@/ui/Button";
import { LoginBanner } from "@/banners/login/LoginBanner";
import { useApplication } from "@/context/Application.context";
import { Avatar } from "@/components/Avatar";
import { useUser } from "@/context/User.context";
import { useEffect } from "react";
import { Logins, User } from "@/dto/User";
import { cn } from "@/lib/utils";

export function Connections() {
  const { lang } = useLanguage();
  const { spawnBanner } = useApplication();
  const { user, setUser } = useUser();

  const button = <Button
    img='https://cdn.impactium.fun/ui/action/add-plus.svg'
    onClick={() => spawnBanner(<LoginBanner connect={true} />)}>{lang.account.connect}</Button>

    useEffect(() => {
      !user!.logins && api<User<Logins>>('/user/get?logins=true').then(user => setUser(user))
    }, [user]);

  return (
    <Card className={cn(s.account, s.connections)} id='connections' description={{
      text: lang.account.connections_description,
      button
    }}>
      <h6>{lang.account.connections}</h6>
      <p>{lang.account.connections_content}</p>
      <section>
        {user?.logins?.length && user.logins.map((login: Login) => (
          <Unit key={login.id} login={login} />
        ))}
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
