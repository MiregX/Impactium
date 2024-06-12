'use client'
import { useApplication } from '@/context/Application';
import s from './Onboarding.module.css'
import { useLanguage } from '@/context/Language';
export function VideoHighlight() {
  const { application } = useApplication();
  const { lang } = useLanguage()
  const keys: string[] = ['users_count', 'teams_count', 'tournaments_count'];
  return (
    <div className={s.videoWrapper}>
      <span className={s.gradient} />
      <div className={s.statistics}>
      {keys.map((key, index) => (
        <section key={index}>
          <img alt="" />
          <p>{lang.main[key]}</p>
          <code>{application.statistics[key]}</code>
        </section>
      ))}
      </div>
      <video
        autoPlay={true}
        muted={true}
        loop={true}
        playsInline={true}
        disablePictureInPicture={true}
        src='https://cdn.impactium.fun/video/ti_highlight_semi_alpha.mp4' />
    </div>
  );
}