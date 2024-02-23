'use client'
import React, { useEffect, useState } from 'react';
import styles from '@/styles/Header.module.css';

const HeaderBackground: React.FC = () => {
  const [topValue, setTopValue] = useState(0);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const newTopValue = Math.max(-80, Math.min(0, -80 + scrollY));
    setTopValue(newTopValue);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (true) {
      setTopValue(-80);
      window.removeEventListener('scroll', handleScroll);
    } else {
      setTopValue(0);
      window.addEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className={styles.headerBackground} style={{ top: `${topValue}px` }}></div>
  );
}

export default HeaderBackground;
