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
import { TeamInviteStatus } from '@/dto/TeamInvite.dto';

export default function TeamJoinPage() {
  const { team } = useTeam();
  const { lang } = useLanguage();
  const { id, valid, loaded } = useTeamJoin();

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
    if (valid === TeamInviteStatus.NotFound) return NotFound;
    if (valid === TeamInviteStatus.Expired) return Expired;
    if (valid === TeamInviteStatus.Used) return Used;
  }

  return (
    <PanelTemplate center>
      <Card className={s.card}>
        {!valid
          ? Loading
          : valid === TeamInviteStatus.Valid
            ? (<React.Fragment>
              <p>Вас пригласили в команду</p>
              <Combination id={team.indent} src={team.logo} name={team.title} />
              </React.Fragment>)
            : <Invalid />
        }
      </Card>
    </PanelTemplate>
  )
}
