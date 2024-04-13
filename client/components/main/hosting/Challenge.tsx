import s from '@/styles/main/Hosting.module.css'
import React from 'react';
import { Service } from './Service';

export function Challenge() {

  return (
    <div className={s.challenge}>
      <Service type='hosting' />
      <Service type='developer' />
    </div>
  );
}