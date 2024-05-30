'use client'
import { ServiceList } from "@/dto/Status"
import { useStatus } from '../context'
import s from '../Status.module.css'
import { useLanguage } from "@/context/Language"

export function Unit({ name }: {
  name: ServiceList
}) {
  const { status } = useStatus();
  const { lang } = useLanguage();
  const service = status?.[name] || {
    ping: 999,
    info: {}
  }
  const latency = service.ping < 25
    ? 'good'
    : (service.ping < 500
      ? 'warn'
      : 'error'
    );

  return (
    <div className={`${s.unit} ${s[name]}`}>
      <h6>
        <img src={`https://cdn.impactium.fun/tech/${name}.png`} />
        {lang.status[name]}
      </h6>
      <p className={`${s.status} ${s[latency]}`}>
        {lang.status[latency]}
        <span />
        {service.ping < 999 ? `~${service.ping.toFixed(0)} ms` : '>999ms'}
      </p>
    </div>
  )
}