import s from './styles/Onboarding.module.css'
export function VideoHighlight() {
  return (
    <div className={s.videoWrapper}>
      <span className={s.gradient} />
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