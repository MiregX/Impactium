'use client'
import { Avatar } from "@/components/Avatar";
import { PanelTemplate } from "@/components/PanelTempate";
import { useLanguage } from "@/context/Language.context";
import { Tournament } from "@/dto/Tournament";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { useEffect, useState } from "react";
import s from './Admin.module.css';
import { Skeleton } from "@/ui/Skeleton";
import { cn } from "@/lib/utils";
export default function AdminPage() {
  const { lang } = useLanguage();
  const [tournaments, setTournaments] = useState<Tournament[] | null>(null);
  
  const reloadTournaments = () => api<Tournament[]>('/tournament/get', setTournaments)

  useEffect(() => {
    if (!tournaments) reloadTournaments();
  }, [tournaments])

  const deleteTournament = (id: string) => {
    api(`/tournament/delete/${id}`, {
      method: 'DELETE'
    }, reloadTournaments)
  }

  return (
    <PanelTemplate useStart>
      <Card className={s.tournaments}>
        <h6>{lang.tournament.delete}</h6>
        {tournaments ? tournaments?.map(tournament => (
          <div className={s.unit}>
            <Avatar size={36} src={tournament.banner} alt={tournament.title} />
            <div className={s.sub}>
              <p className={s.bold}>{tournament.title}</p>
              <p>@{tournament.code}</p>
            </div>
            <Button img='https://cdn.impactium.fun/ui/trash/full.svg' size='icon' variant='ghost' onClick={() => deleteTournament(tournament.id)} />
          </div>
        )) : Array.from({ length: 4}).map((_, i) => (
          <div className={s.unit}>
            <Skeleton variant='avatar' size='icon' />
            <div className={s.sub}>
              <Skeleton />
              <Skeleton width={96} />
            </div>
            <Skeleton size='icon' />
          </div>
        ))}
      </Card>
    </PanelTemplate>
  )
}