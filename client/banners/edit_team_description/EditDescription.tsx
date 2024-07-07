'use client'
import { Banner } from '@/ui/Banner'
import _ from './EditTeamDescription.module.css'
import { Button } from '@/ui/Button';
import { useLanguage } from '@/context/Language.context';
import { Tournament } from '@/dto/Tournament';
import { Team } from '@/dto/Team';
import { useApperand } from '@/decorator/useAperand';
import { useState } from 'react';

export function EditDescription({ state, type }: { state: Team | Tournament, type: 'team' | 'tournament' }) {
  const { lang } = useLanguage();
  const [value, setValue] = useState<string>(state.description);

  const save = async () => {
    await api(`/${type}/${useApperand(state, ['indent', 'code'])}/edit/description`, {
      method: 'PATCH',
      body: JSON.stringify({
        description: value
      })
    })
  }

  const footer = {
    right: [
      <Button img='https://cdn.impactium.fun/ui/check/big.svg' onClick={save}>{lang._save}</Button>
    ]
  }

  return (
    <Banner title={lang.change.description} footer={footer}>
      <textarea value={value} onChange={(e) => setValue(e.currentTarget.value)}/>
    </Banner>
  )
}