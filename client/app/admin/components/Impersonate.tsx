'use client'
import { useLanguage } from '@/context/Language.context';
import { Card } from '@/ui/Card';
import s from '../Admin.module.css';
import { Combination } from '@/ui/Combitation';
import { User, UserEntity } from '@/dto/User';
import { ChangeEvent, useState } from 'react';
import { useUser } from '@/context/User.context';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { useRouter } from 'next/navigation';

export function Impersonate() {
  const { lang } = useLanguage();
  const { refreshUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const impersonate = (uid: UserEntity['uid']) => {
    api<string>(`/user/impersonate/${uid}`, {
      toast: 'user_impersonated_successfully'
    }, refreshUser).then(() => router.push('/account'));
  }

  const find = () => api<User[]>(`/user/find`, {
    query: { search },
    setLoading
  }, setUsers);

  const handleSetSearchInput = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

  return (
    <Card className={s.impersonate}>
      <h6>{lang.impersonate}</h6>
      <div className={s.input_group}>
        <Input onChange={handleSetSearchInput} />
        <Button loading={loading} img='UserSearch' onClick={find} />
      </div>
      <div className={s.result_wrapper}>
        {users.map(user => (
          <div className={s.unit}>
            <Combination src={user.avatar} name={user.displayName} id={user.username} />
            <Button size='icon' variant='ghost' onClick={() => impersonate(user.uid)} img='VenetianMask' />
          </div>
        ))}
      </div>
    </Card>
  )
}