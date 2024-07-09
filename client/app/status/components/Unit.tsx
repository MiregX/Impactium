'use client'
import { ServiceList } from "@/dto/Status"
import { useStatus } from '../context'
import s from '../Status.module.css'
import { useLanguage } from "@/context/Language.context"
import { Graph } from "./Graph"

export function Unit({ name }: {
  name: ServiceList
}) {
  const { status } = useStatus();
  const { lang } = useLanguage();

  const { ping = 999, info } = status.pop()?.[name] || {
    ping: 999,
    info: {}
  }

  const latency = ping < 50
    ? 'good'
    : (ping < 250
      ? 'warn'
      : 'error'
    );

  const array = status.map(obj => obj[name].ping);

  return (
    <div className={`${s.unit} ${s[name]}`}>
      <h6>
        <img src={`https://cdn.impactium.fun/tech/${name}.png`} />
        {lang.status[name]}
      </h6>
      <Graph array={array} />
      <p className={`${s.status} ${s[latency]}`}>
        {lang.status[latency]}
        <span />
        {ping < 999 ? `~${ping} ms` : '>999ms'}
      </p>
    </div>
  )
}