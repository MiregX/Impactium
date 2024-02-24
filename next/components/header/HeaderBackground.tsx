'use client'
import React, { useEffect, useState } from 'react';
import styles from '@/styles/Header.module.css';

function HeaderBackground() {
  const [topValue, setTopValue] = useState<number>(0);
  const [isHeaderBackgroundHidden, setIsHeaderBackgroundHidden] = useState<boolean>(false);  

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const newTopValue = Math.max(-80, Math.min(0, -80 + scrollY));
    setTopValue(newTopValue);
  };

  useEffect(() => {
    if (typeof window === 'undefined')
      return;

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined')
      return;

    if (!isHeaderBackgroundHidden) {
      setTopValue(-80);
      window.removeEventListener('scroll', handleScroll);
    } else {
      setTopValue(0);
      window.addEventListener('scroll', handleScroll);
    }
  }, [isHeaderBackgroundHidden]);

  return (
    <div
      className={styles.headerBackground}
      style={{ top: `${topValue}px`, zIndex: 3 }}
      onClick={() => setIsHeaderBackgroundHidden(!isHeaderBackgroundHidden)}>
    </div>
  );
}

export default HeaderBackground;
