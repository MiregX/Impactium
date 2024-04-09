import React, { useEffect, useRef } from 'react';
import styles from '@/styles/Index.module.css';
import { useLanguage } from '@/context/Language';
import { useUser } from "@/context/User";
import Link from "next/link";

const PrivilegesList = () => {
  const privilegesListRef = useRef<HTMLUListElement>(null);
  const panelRight = useRef(null); 
  const { user } = useUser();
  const { lang } = useLanguage();  

  useEffect(() => {
    animation();
    const lis = privilegesListRef.current?.querySelectorAll('li');
    lis.forEach((li, index) => {
      setTimeout(() => {
        li.classList.add(styles.maxWidth);
      }, (index + 1) * 250);
    });
  }, []);

  const animation = () => {
    setTimeout(() => {
      if (!panelRight.current) return;
      panelRight.current.style.transform = 'translateX(16px)';
      panelRight.current.style.opacity = '1';
  
    }, 400);
  };

  return (
    <div ref={panelRight} className={styles.right}>
    <div className={styles.backgroundWrapper}>
      <img className={`${styles.diamond} ${styles.background}`} src="https://cdn.impactium.fun/ui/diamond-full-pattern.svg" alt="Diamond" />
      <img className={`${styles.mireg} ${styles.background}`} src="https://cdn.impactium.fun/ui/mireg_with_shield.png" alt="Mireg" />
    </div>
    <h2>{lang.playOnOurProject}</h2>
    <ul ref={privilegesListRef} className={styles.privileges}>
      <li itemType="hammer">{lang.administrationNotIntervenes}<hr /></li>
      <li itemType="casual">{lang.openWorldWithoutPrivates}<hr /></li>
      <li itemType="defence">{lang.sendAthletesAgainstNonRP}<hr /></li>
      <li itemType="killer">{lang.uniqueRewardsSystem}<hr /></li>
      <li itemType="event">{lang.masterpieceRoleplayWithAdmins}<hr /></li>
      <li itemType="donate">{lang.donateAndGetUniqueSkin}<hr /></li>
    </ul>
    <Link href={user ? '/me/account' : '/me/account'}>
      {lang.account}
    </Link>
  </div>
  );
};

export default PrivilegesList;