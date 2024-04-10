import s from '@/styles/Index.module.css';
import React from 'react';

export function Cloud() {
  return (
    <video autoPlay={true} muted={true} loop={true} playsInline={true} disablePictureInPicture={false} className={s.cloud}>
      <source src="https://io.aeza.net/videos/cloud.mp4" type="video/mp4" />
    </video>
  );
}