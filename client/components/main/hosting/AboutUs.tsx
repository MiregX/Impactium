import React, { useEffect, useRef } from 'react';
import styles from '@/styles/Main.module.css';
import { useLanguage } from '@/context/Language';


export function AboutUs() {
  const { lang } = useLanguage();  
  const aboutUsMainTextRef = useRef<HTMLParagraphElement>(null);
  const aboutUsDescriptionTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const descriptionBlocksAnimationInit = (currentIndex: number) => {
      const descriptionBlocks = aboutUsDescriptionTextRef.current?.querySelectorAll('p');
      descriptionBlocks?.forEach((block, index) => {
        block.classList.remove(styles.onMove, styles.active);
        if (index === currentIndex) {
          block.classList.add(styles.active);
        } 
      });
      
      currentIndex = (currentIndex + 1) % (descriptionBlocks?.length || 1);
      const timeout = setTimeout(() => {
        descriptionBlocksAnimationInit(currentIndex);
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    };

    const animationInterval = setInterval(() => {
      descriptionBlocksAnimationInit(1);
    },5000);

    return () => {
      clearInterval(animationInterval);
    };
  }, []);

  function animation(isUnmount: boolean) {
    const aboutUsMainText = aboutUsMainTextRef.current;
    const aboutUsDescriptionText = aboutUsDescriptionTextRef.current;

    if (!aboutUsMainText || !aboutUsDescriptionText) return;

    const timeout = isUnmount ? 0 : 400;
    setTimeout(() => {
      const opacity = isUnmount ? '0' : '1';
      const transition = isUnmount ? '' : ['translateX(16px)', 'translateX(0px)'];
      aboutUsMainText.style.transform = Array.isArray(transition) ? transition[1] : transition;
      aboutUsMainText.style.opacity = opacity;
      aboutUsDescriptionText.style.transform = Array.isArray(transition) ? transition[1]: transition;
      aboutUsDescriptionText.style.opacity = opacity;
    }, timeout);
  }

  useEffect(() => {
    animation(false);
  }, []);

  return (
    <div className={styles.aboutUs}>
      <div className={styles.left}>
        <p ref={aboutUsMainTextRef} className={styles.mainText}>{lang.joinToUs}</p>
        <div ref={aboutUsDescriptionTextRef} className={`${styles.descriptionsWrapper} flex flex-dir-column align-center`}>
          { lang.joinToUsDescription.map((text, index) => (
            <p key={index} className={`${styles.supportText} ${styles.active} ${styles.onMove}`}>{text}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
