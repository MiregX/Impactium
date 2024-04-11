import s from './Hosting.module.css'
import React from 'react';
import { Service } from './Service';

export function Challenge() {
  const hostingDescription = <React.Fragment>
    <p>Мечтаешь создать свой сервер в Rust, Minecraft, CS:GO? Мы воплотим твои влажные мечты в реальность.</p>
    <ul>
      <li>Готовые сборки</li>
      <li>Панель управления</li>
      <li>Uptime 99%</li>
      <li>Айпи-адресс в подарок</li>
    </ul>
  </React.Fragment>

  return (
    <div className={s.challenge}>
      <h3>Our challenge!</h3>
      <Service src='' title='' desc={hostingDescription} />
      <Service src='' title='' desc='' />
    </div>
  );
}