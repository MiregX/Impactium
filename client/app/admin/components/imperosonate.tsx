import { User } from '@/context/User.context';
import { Select } from '@/ui/Select';
import { Button, Input, Stack } from '@impactium/components';
import { cn } from '@impactium/utils';
import { ChangeEvent, useState } from 'react';
import s from './impersonate.module.css';
import { Avatar } from '@/ui/Avatar';

export namespace Impersonate {
  export interface Props extends Stack.Props {
  }
}

export function Impersonate({ className, ...props }: Impersonate.Props) {
  const [users, setUsers] = useState<User.Interface[]>([]);
  const [search, setSearch] = useState<string>('');
  const [user, setUser] = useState<User.Interface | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const searchButtonClickHandler = () => {
    api<User.Interface[]>('/user/find', {
      method: 'GET',
      setLoading,
      query: {
        search
      }
    }, setUsers);
  }

  const searchInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSearch(value);
  }

  return (
    <Stack className={cn(s.impersonate, className)} dir='column' ai='stretch' {...props}>
      <Stack>
        <Input img='Users' variant='highlighted' placeholder='Username' value={search} onChange={searchInputChangeHandler} />
        <Button variant='secondary' img='MagnifyingGlass' onClick={searchButtonClickHandler} loading={loading} />
      </Stack>
      <Stack>
        <Select.Root onValueChange={uid => setUser(users.find(u => u.uid === uid) ?? null)}>
          <Select.Trigger>
            <Select.Icon name='User' />
            <p>{user ? user.displayName : 'Select user below'}</p>
          </Select.Trigger>
          <Select.Content>
            {users.map(u => {
              const user = new User.Class(u);
              return (
                <Select.Item value={user.uid}>
                  <User.Combination user={user} />
                </Select.Item>
              )
            })}
          </Select.Content>
        </Select.Root>
      </Stack>
    </Stack>
  )
}