'use client'
import { Language } from '@/context/Language.context';
import { Card } from '@/ui/card';
import s from '../Account.module.css';
import { Button, Stack } from '@impactium/components';
import { Application } from '@/context/Application.context';
import { Avatar } from '@/ui/Avatar';
import { User } from '@/context/User.context';
import { useEffect, useState } from 'react';
import { cn } from '@impactium/utils';
import { Icon } from '@impactium/icons';
import { Login } from '@/banners/login/Login';

export function Connections() {
  const { lang } = Language.use();
  const { spawnBanner } = Application.use();
  const { user, setUser } = User.use<User.RequiredExport>();
  const [fetched, setFetched] = useState<boolean>(!!user?.logins);

  useEffect(() => {
    (async () => {
      if (!fetched) {
        await api<User.Interface>('/user/get?logins=true').then(user => user && setUser(new User.Class(user)));
        setFetched(true);
      }
    })();
  }, [user]);

  return (
    <Card.Root className={cn(s.account, s.connections)} id='connections'>
      <Card.Title>{lang.account.connections}</Card.Title>
      <Card.Content>
        <Stack ai='stretch' dir='column' className={s.list}>
          {(user.logins || []).map(login => (
            <Unit key={login.id} login={login} />
          ))}
        </Stack>
      </Card.Content>
      <Card.Description>
        <p>{lang.account.connections_content}</p>
      </Card.Description>
    </Card.Root>
  );

};

function Unit({ login }: { login: Login.Interface }) {
  return (
    <Stack className={s.unit} pos='relative' gap={24}>
      <Avatar
        size={32}
        style={{ zIndex: 1 }}
        src={login.avatar}
        alt={login.displayName} />
      <Avatar
        className={s.login_method}
        size={32}
        src={`https://cdn.impactium.fun/tech/${login.type}.png`}
        alt={login.displayName} />
      <p>{login.displayName}</p>
      <Button style={{ pointerEvents: 'none' }} variant='glass' img='Command'>{login.id}</Button>
    </Stack>
  );
}
