'use client'
import { Banner } from '@/ui/Banner'
import _ from './EditTeamDescription.module.css'
import { _server } from '@/dto/master'
import { GeistButton, GeistButtonTypes } from '@/ui/Button';
import { useLanguage } from '@/context/Language';

export function EditTeamDescription({ team }) {
  const { lang } = useLanguage();

  const save = async (description: string) => {
    await fetch(`${_server()}/api/team/${team.indent}/edit/description`, {
      method: 'PATCH',
      credentials: 'include',
      body: description
    })
  }

  const footer = {
    right: [
      <GeistButton options={{
        type: GeistButtonTypes.Button,
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