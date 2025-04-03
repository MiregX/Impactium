'use client'
import Cookies from 'universal-cookie';
import { useState, useEffect, createContext, useContext } from 'react';
import { Parent } from '@/types';
import { λCookie } from '@impactium/pattern';
import { Combination as UICombination } from '@/ui/Combitation';
import { Application } from './Application.context';
import { Language } from './Language.context';
import s from './User.module.css'
import { Avatar } from '@/ui/Avatar';
import Link from 'next/link';
import { Icon } from '@impactium/icons/dist';
import { Separator } from '@/ui/Separator';
import { Login } from '@/banners/login/Login';

export function UserProvider({ children, prefetched }: User.Provider.Props) {
  const cookie = new Cookies();
  const [isUserFetched, setIsUserFetched] = useState(!!prefetched);
  const [user, setUser] = useState<User.Class | null>(prefetched ? new User.Class(prefetched) : null);

  useEffect(() => {
    !isUserFetched && cookie.get(λCookie.Authorization) && refreshUser()
  }, [isUserFetched]);

  const getUser = (token?: string) => api<User.Interface>('/user/get', {
    headers: {
      [λCookie.Authorization]: token || ''
    }
  });

  if (cookie.get('uuid')) {
    api<string>('/oauth2/telegram/callback', {
      method: 'POST'
    }).then(token => {
      cookie.set('Authorization', token);
      refreshUser();
    });
  }

  const logout = () => {
    cookie.remove(λCookie.Authorization);
    refreshUser();
  };

  const refreshUser = async (token?: string) => await getUser(token).then(user => {
    setUser(user ? new User.Class(user) : null);
    setIsUserFetched(true);
  });

  const assignUser = (user: Partial<User.Interface>) => setUser((_user) => _user!.assign(user));

  const userProps: User.Export = {
    user,
    setUser,
    logout,
    getUser,
    refreshUser,
    assignUser,
  };
  return (
    <User.Context.Provider value={userProps}>
      {children}
    </User.Context.Provider>
  );
};

export namespace User {
  export interface Interface {
    uid: string,
    registered: string,
    email?: string,
    username: string,
    avatar: string | null,
    displayName: string,
    login: Login.Interface
    logins?: Login.Interface[],
  }
  
  export class Class implements User.Interface {
    uid: string;
    registered: string;
    email?: string;
    login: Login.Interface;
    logins?: Login.Interface[]
    // privates
    private _avatar: string | null;
    private _displayName: string;
    private _username: string;
    
    constructor(user: User.Interface) {
      this.uid = user.uid;
      this.registered = user.registered;
      this.email = user.email;
      this._username = user.username;
      this._displayName = user.displayName;
      this._avatar = user.avatar;
      this.login = user.login || (user.logins ? user.logins[0] : null);
      this.logins = user.logins;
    }
  
    get avatar(): string | null {
      return this._avatar || this.login?.avatar || null;
    }
  
    get displayName(): string {
      return this._displayName || this.login?.displayName;
    }
  
    get username(): string {
      return this._username || this.login?.id;
    }
  
    public static normalize = (user: User.Class) => ({
      ...user,
      avatar: user._avatar,
      displayName: user._displayName,
      username: user._username
    })
  
    assign = (user: Partial<User.Interface>) => Object.assign(this, user);
  }

  export const Context = createContext<User.Export | undefined>(undefined);

  export interface Export {
    user: User.Class | null,
    setUser: React.Dispatch<React.SetStateAction<User.Class | null>>,
    logout: () => void,
    getUser: (authorization?: string) => Promise<User.Interface | null>,
    refreshUser: (token?: string) => Promise<void>,
    assignUser: (user: Partial<User.Interface>) => void,
  }

  export interface RequiredExport extends User.Export {
    user: User.Class
  }

  export const use = <T extends User.Export = User.Export>() => useContext(User.Context)! as T;

  export namespace Provider {
    export interface Props extends Parent {
      prefetched: User.Interface | null;
    }  
  }

  export namespace Combination {
    export interface Props extends Partial<UICombination.Props> {
      user: User.Class | undefined | null;
    }
  }

  export const Combination = ({ user, ...props }: User.Combination.Props) => user ? <UICombination id={user.username} src={user.avatar} name={user.displayName} {...props} /> : <UICombination.Skeleton {...props} />;

  export function Component() {
    const { user, logout } = User.use<User.RequiredExport>();
  const { spawnBanner } = Application.use();
  const { lang } = Language.use();
  const [active, setActive] = useState<boolean>(false);

  const toggle = () => {
    setActive((active) => !active);
  }

  const handle = (func: Function) => {
    toggle();
    func();
  }

  return (
    <div className={`${s.user} ${active && s.active}`}>
      <div className={s.action_lock} onClick={toggle} />
        <Avatar
          className={s.wrapper}
          size={36}
          alt={user.displayName}
          src={user.avatar}
          onClick={toggle} />
      <nav className={s.menu}>
        <p className={s.name}>{user.email || user.displayName}</p>
        {user.uid === 'system' && (
          <Link href='/admin' onClick={toggle}>
            {lang._admin_panel}
            <Icon name='Fingerprint' />
          </Link>
        )}
        <Link href='/account' onClick={toggle}>
          {lang._account}
          <Icon name='Settings' variant='dimmed' />
        </Link>
        <Link href='/account/inventory' onClick={toggle}>
          {lang._inventory}
          <Icon name='PackageOpen' variant='dimmed' />
        </Link>
        <Separator />
        <Link href='/account#balance' onClick={toggle}>
          {lang.balance.top_up}
          <span>{0}<Icon name='DollarSign' variant='dimmed' /></span>
        </Link>
        <button onClick={() => handle(() => spawnBanner(<Language.Chooser />))}>
          {lang.choose.language}
          <Icon name='Globe' variant='dimmed' />
        </button>
        <Separator />
        <button onClick={() => handle(logout)}>
          {lang.logout}
          <Icon variant='dimmed' name='LogOut' />
        </button>
      </nav>
    </div>
  );
}
}