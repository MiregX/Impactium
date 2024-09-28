'use client'
import { useLanguage } from '@/context/Language.context';
import { Card } from '@/ui/Card';
import s from '../Admin.module.css';
import { Combination } from '@/ui/Combitation';
import { User, UserEntity } from '@/dto/User';
import { ChangeEvent, useState } from 'react';
import { useUser } from '@/context/User.context';
import { Input } from '@/ui/Input';
import { UserFindByUsernameOrDisplayNameRequest } from '@/dto/UserFindByUsernameOrDisplayName.request';
import { Button } from '@/ui/Button';

export function Impersonate() {
  const { lang } = useLanguage();
  const { refreshUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>('');

  const impersonate = (uid: UserEntity['uid']) => {
    api<string>(`/user/imperosonate/${uid}`, {
      toast: 'user_impersonated_successfully'
    }, refreshUser);
  }

  const find = () => {
    api<User[]>('/user/find', {
      method: 'GET',
      body: UserFindByUsernameOrDisplayNameRequest.create(search)
    })
  }

  const handleSetSearchInput = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

  return (
    <Card className={s.imperosonate}>
      <h6>{lang.imperosonate}</h6>
      <div className={s.input_group}>
        <Input onChange={handleSetSearchInput} />
        <Button variant={!search.length ? 'disabled' : 'default'} img='UserSearch' onClick={find} />
      </div>
      <div className={s.result_wrapper}>
        {users.map(user => (
          <div className={s.unit}>
            <Combination src={user.avatar} name={user.displayName} id={user.username} />
            <Button size='icon' variant='ghost' onClick={() => impersonate(user.uid)} />
          </div>
        ))}
      </div>
    </Card>
  )
}