import s from '@/styles/main/Hosting.module.css';
import React from 'react';

export function Cloud() {
  return (
    <div className={s.videoHolder}>
      <video autoPlay={true} muted={true} loop={true} playsInline={true} disablePictureInPicture={false} className={s.cloud}>
        <source src="https://io.aeza.net/videos/cloud.mp4" type="video/mp4" />
      </video>
    </div>
  );
}