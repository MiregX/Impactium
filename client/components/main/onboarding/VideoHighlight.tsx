'use client'
import { useApplication } from '@/context/Application';
import s from './Onboarding.module.css'
export function VideoHighlight() {
  const { application } = useApplication()
  return (
    <div className={s.videoWrapper}>
      <span className={s.gradient} />
      <div className={s.statistics}>
      <section>{application?.statistics?.users_count}</section>
      <section>{application?.statistics?.teams_count}</section>
      <section>{application?.statistics?.tournaments_count}</section>
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