'use client'
import { PanelTemplate } from '@/components/PanelTempate';
import { Card } from '@/ui/Card';
import { useTeam } from '../../team.context';
import { useTeamJoin } from './join.context';
import s from './Join.module.css';
import { Combination } from '@/ui/Combitation';
import React, { useMemo } from 'react';
import { Icon } from '@/ui/Icon';
import { useLanguage } from '@/context/Language.context';
import { Button } from '@/ui/Button';
import { Separator } from '@/ui/Separator';
import { useUser } from '@/context/User.context';
import { λError } from '@impactium/pattern';

export default function TeamJoinPage() {
  const { team } = useTeam();
  const { lang } = useLanguage();
  const { id, valid } = useTeamJoin();
  const { user } = useUser();

  const Loading = useMemo(() => (
    <div className={s.node}>
      <Icon size={36} className={s.spin} name='LoaderCircle' />
      <p>Проверяем приглашение</p>
    </div>
  ), []);

  const Expired = useMemo(() => (
    <div className={s.node}>
      <div className={s.wrap}>
        <Icon size={28} name='TicketX' />
        <p>Приглашение просрочено</p>
      </div>
      <Button>Вернуться на главную</Button>
    </div>
  ), []);

  const NotFound = useMemo(() => (
    <div className={s.node}>
      <div className={s.wrap}>
        <Icon size={28} name='TicketX' />
        <p>Приглашения не найдено</p>
      </div>
      <Button>Вернуться на главную</Button>
    </div>
  ), []);

  const Used = useMemo(() => (
    <div className={s.node}>
      <div className={s.wrap}>
        <Icon size={28} name='TicketX' />
        <p>Приглашение использовано</p>
      </div>
      <Button>Вернуться на главную</Button>
    </div>
  ), []);

  const Invalid = () => {
    if (valid === λError.team_invite_not_found) return NotFound;
    if (valid === λError.team_invite_expired) return Expired;
    if (valid === λError.team_invite_used) return Used;
  }

  const decline = async () => {
    api<boolean>(`/team/${team.indent}/decline/${id}`, {
      method: 'POST'
    });
  }

  const confirm = () => {
    api<boolean>(`/team/${team.indent}/join/${id}`, {
      method: 'PUT'
    });
  }

  const ConfirmGroup = () => {
    return (
      <div className={s.confirmation_group}>
        <Button variant='ghost' onClick={decline}>Decline</Button>
        <Button onClick={confirm}>Присоеденится</Button>
      </div>
    )
  };

  return (
    <PanelTemplate center>
      <Card className={s.card}>
        {!valid
          ? Loading
          : typeof valid === 'object'
            ? (<React.Fragment>
              <p>Вас пригласили в команду</p>
              <Separator />
              <Combination id={team.indent} src={team.logo} name={team.title} />
              <ConfirmGroup />
              </React.Fragment>)
            : <Invalid />
        }
      </Card>
    </PanelTemplate>
  )
}
