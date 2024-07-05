'use client'
import { Banner } from '@/ui/Banner'
import _ from './EditTeamDescription.module.css'
import { Button, ButtonTypes } from '@/ui/Button';
import { useLanguage } from '@/context/Language.context';
import { Tournament } from '@/dto/Tournament';
import { Team } from '@/dto/Team';
import { useApperand } from '@/decorator/useAperand';

export function EditDescription({ state, type }: { state: Team | Tournament, type: 'team' | 'tournament' }) {
  const { lang } = useLanguage();

  const save = async (description: string) => {
    await api(`/${type}/${useApperand(state, ['indent', 'code'])}/edit/description`, {
      method: 'PATCH',
      body: description
    })
  }

  const footer = {
    right: [
      <Button options={{
        type: ButtonTypes.Button,
        text: lang._save,
        do: () => save,
        img: 'https://cdn.impactium.fun/ui/check/big.svg',
        focused: true
      }} />
    ]
  }

  return (
    <Banner title={lang.change.description} footer={footer}>
      <textarea />
    </Banner>
  )
}