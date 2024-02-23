'use client'
import Link from "next/link";
import React, { useEffect } from 'react';
import { effect, signal } from '@preact/signals-react';
import styles from '@/Index.module.css';
import { lang } from '@/context/Language'

export const x = signal(0);

export default function Main() {
  console.log(lang)
  return (
    <div className="panel">
      <div className="about-us">
        <div className="center flex-dir-column">
          <p className="main-text">{lang.joinToUs}</p>
          <div className="descriptions-wrapper flex flex-dir-column align-center">
            {lang.joinToUsDescription.length > 3 && lang.joinToUsDescription.map((text, index) => (
              <p key={index} className="support-text">{text}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="right flex-dir-column">
        <div className="background-wrapper">
          <img className="diamond background" src="https://cdn.impactium.fun/ui/diamond-full-pattern.svg" alt="Diamond" />
          <img className="mireg background" src="https://cdn.impactium.fun/ui/mireg_with_shield.png" alt="Mireg" />
        </div>
        <h2>{lang.playOnOurProject}</h2>
        <ul className="privileges">
          <li itemType="hammer">{lang.administrationNotIntervenes}<hr /></li>
          <li itemType="casual">{lang.openWorldWithoutPrivates}<hr /></li>
          <li itemType="defence">{lang.sendAthletesAgainstNonRP}<hr /></li>
          <li itemType="killer">{lang.uniqueRewardsSystem}<hr /></li>
          <li itemType="event">{lang.masterpieceRoleplayWithAdmins}<hr /></li>
          <li itemType="donate">{lang.donateAndGetUniqueSkin}<hr /></li>
        </ul>
        <a href="https://impactium.fun/me/minecraft">
          {lang.myProfile}
        </a>
      </div>
    </div>
  );
};