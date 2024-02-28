'use client'
import { useRef, useEffect } from "react";
import Link from "next/link";
import styles from '@/styles/Index.module.css';
import { useLanguage } from '@/context/Language'

export default function Main() {
  const { lang, user } = useLanguage();
  const glRef = useRef<HTMLDivElement>(null);
  const aboutUsMainTextRef = useRef<HTMLParagraphElement>(null);
  const aboutUsDescriptionTextRef = useRef<HTMLDivElement>(null);
  const privilegesListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const gl = glRef.current;
    const aboutUsMainText = aboutUsMainTextRef.current;
    const aboutUsDescriptionText = aboutUsDescriptionTextRef.current;
    
    setTimeout(() => {
      if (gl && aboutUsMainText && aboutUsDescriptionText) {
        gl.style.transform = 'translateX(16px)';
        gl.style.opacity = '1';
        aboutUsMainText.style.transform = 'translateX(0px)';
        aboutUsMainText.style.opacity = '1';
        aboutUsDescriptionText.style.transform = 'translateX(0px)';
        aboutUsDescriptionText.style.opacity = '1';
      }
    }, 400);

    const lis = privilegesListRef.current?.querySelectorAll('li');
    lis.forEach((li, index) => {
      setTimeout(() => {
        li.classList.add(styles.maxWidth);
      }, (index + 1) * 250);
    });
  }, []);

  useEffect(() => {
    const descriptionBlocksAnimationInit = (currentIndex: number) => {
      const descriptionBlocks = aboutUsDescriptionTextRef.current?.querySelectorAll('p');
      descriptionBlocks?.forEach((block, index) => {
        block.classList.remove(styles.onMove, styles.active);
        if (index === currentIndex) {
          block.classList.add(styles.active);
        } else if (index === ((currentIndex === 0) ? (descriptionBlocks.length - 1) : (currentIndex - 1))) {
          block.classList.add(styles.onMove);
        }
      });
      currentIndex = (currentIndex + 1) % (descriptionBlocks?.length || 1);
      const timeout = setTimeout(() => {
        descriptionBlocksAnimationInit(currentIndex);
      }, 4000);

      return () => {
        clearTimeout(timeout);
      };
    };

    const animationInterval = setInterval(() => {
      descriptionBlocksAnimationInit(1);
    }, 4000);

    return () => {
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <div className={styles.panel}>
      <div className={styles.aboutUs}>
        <div className={styles.left}>
          <p ref={aboutUsMainTextRef} className={styles.mainText}>{lang.joinToUs}</p>
          <div ref={aboutUsDescriptionTextRef} className={`${styles.descriptionsWrapper} flex flex-dir-column align-center`}>
            {lang.joinToUsDescription.length > 3 && lang.joinToUsDescription.map((text: string, index: React.Key) => (
              <p key={index} className={`${styles.supportText} ${styles.active} ${styles.onMove}`}>{text}</p>
            ))}
          </div>
        </div>
      </div>
      <div ref={glRef} className={styles.right}>
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
        <Link href="/me/account">
          {lang.myProfile}
        </Link>
      </div>
    </div>
  );
};