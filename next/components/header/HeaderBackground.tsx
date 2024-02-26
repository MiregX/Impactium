'use client';
import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useHeader } from '@/context/Header';
import styles from '@/styles/Header.module.css';

function HeaderBackground() {
  const url = usePathname();
  const self = useRef<HTMLHRElement | null>(null);
  const { isLoading, setIsLoading } = useHeader();
  const [isHeaderBackgroundHidden, setIsHeaderBackgroundHidden] = useState<boolean>(url === '/');
  const [topValue, setTopValue] = useState<number>(isHeaderBackgroundHidden ? 0 : -80);

  const handleScroll = () => {
    const newTopValue = Math.max(-80, Math.min(0, -80 + window.scrollY));
    setTopValue(newTopValue);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  interface Action {
    value: number;
    eventName: string;
  }

  useEffect(() => {
    if (isLoading) {
      self.current.classList.add(styles.onLoading);
      self.current.classList.remove(styles.onLoaded);
      setTimeout(() => {
        setIsLoading(false);
      }, 400);
    } else {
      self.current.classList.remove(styles.onLoading);
      self.current.classList.add(styles.onLoaded);

    }
  }, [isLoading])

  useEffect(() => {
    const action: Action = isHeaderBackgroundHidden ? { value: -80, eventName: 'removeEventListener' } : { value: 0, eventName: 'addEventListener' };
    setTopValue(action.value);
    window[action.eventName]('scroll', handleScroll);
    setIsLoading(true)
  }, [isHeaderBackgroundHidden]);

  useEffect(() => setIsHeaderBackgroundHidden(url === '/'), [url])

  return (
    <>
      <div
        className={styles.headerBackground}
        style={{ top: `${topValue}px` }}
        onClick={() => setIsHeaderBackgroundHidden(!isHeaderBackgroundHidden)}>
        <hr ref={self} className={`${styles.loader} ${styles.onLoaded}`} />
      </div>
    </>
  );
}

export default HeaderBackground;
