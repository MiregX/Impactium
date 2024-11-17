'use client'
import { useLanguage } from "@/context/Language.context";
import { Card } from "@/ui/Card";
import s from '../Account.module.css';
import { Login } from "@/dto/Login";
import { Button } from "@/ui/Button";
import { LoginBanner } from "@/banners/login/Login.banner";
import { useApplication } from "@/context/Application.context";
import { Avatar } from "@/ui/Avatar";
import { UserRequiredContext, useUser } from "@/context/User.context";
import { useEffect, useState } from "react";
import { User, UserEntity } from "@/dto/User.dto";
import { cn } from "@/lib/utils";
import { Icon } from "@impactium/icons";

export function Connections() {
  const { lang } = useLanguage();
  const { spawnBanner } = useApplication();
  const { user, setUser } = useUser<UserRequiredContext>();
  const [fetched, setFetched] = useState<boolean>(!!user?.logins);

  const button = <Button
    img='UserPlus'
    onClick={() => spawnBanner(<LoginBanner connect={true} />)}>{lang.account.connect}</Button>

    useEffect(() => {
      (async () => {
        if (!fetched) {
          await api<User>('/user/get?logins=true').then(user => user && setUser(new UserEntity(user)));
          setFetched(true);
        }
      })();
    }, [user]);

  return (
    <Card className={cn(s.account, s.connections)} id='connections' description={{
      text: lang.account.connections_description,
      button
    }}>
      <h6>{lang.account.connections}</h6>
      <p>{lang.account.connections_content}</p>
      <section>
        {(user.logins || []).map((login: Login) => (
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
        <Icon name='Command' />{login.id}
      </code>
    </div>
  );
}
