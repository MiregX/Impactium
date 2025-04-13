'use client'
import s from './Login.module.css'
import { Banner as UIBanner } from '@/ui/Banner';
import { LoginMethod } from './components/LoginMethod';
import { Language } from '@/context/Language.context';
import { Stack } from '@impactium/components';

export namespace Login {
  export interface Interface {
    id: string;
    uid: string;
    type: 'discord' | 'steam' | 'telegram' | 'native';
    avatar: string;
    displayName: string;
    on: Date;
  }

  export namespace Banner {
    export interface Props extends UIBanner.Props {
      connect?: true
    }
  }

  export function Banner({ connect, ...props }: Login.Banner.Props) {
    const { lang } = Language.use();

    return (
      <UIBanner title={connect ? lang.account.connect : lang.login.title} {...props}>
        <Stack>
          <LoginMethod type='telegram' />
          <LoginMethod type='discord' />
          <LoginMethod type='steam' />
        </Stack>
      </UIBanner>
    )
  }
}
