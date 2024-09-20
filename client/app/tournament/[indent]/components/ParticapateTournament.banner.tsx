'use client'

import CreateTeam from '@/banners/create_team/CreateTeam'
import { useApplication } from '@/context/Application.context'
import { useUser } from '@/context/User.context'
import { Banner, WarnerTypes } from '@/ui/Banner'
import { Button } from '@/ui/Button'
import { Combination, CombinationSkeleton } from '@/ui/Combitation'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/Select'
import { Separator } from '@/ui/Separator'
import React from 'react'

export function ParticapateTournament() {
  const { spawnBanner } = useApplication();
  const { user } = useUser();

  return (
    <Banner title='Учавствовать в турнире' footer={{
      type: WarnerTypes.tip,
      text: 'Отображаются только команды в которых у вас есть менеджмент доступ'
    }}>
      {user ? (
        <React.Fragment>
          <Select>
            <SelectTrigger>
              <p></p>
            </SelectTrigger>
            <SelectContent>
              {user.teams?.length ? user.teams?.map(team => (
                <SelectItem key={team.indent} value={team.indent}>
                  <Combination id={team.indent} src={team.logo} name={team.title} />
                </SelectItem>
              )) : Array.from({ length: 4 }).map((_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  <CombinationSkeleton key={i} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Separator><i>ИЛИ</i></Separator>
        </React.Fragment>
      ) : <p>Вы не состоите ни в одной команде</p>}
      <Button>Найти команду</Button>
      <Button onClick={() => spawnBanner(<CreateTeam />)}>Создать команду</Button>
    </Banner>
  )
}