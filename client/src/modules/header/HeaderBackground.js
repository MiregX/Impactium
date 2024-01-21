import React, { useEffect, useState } from 'react';
import './HeaderBackground.css';
import { useHeaderContext } from './HeaderContext';

function HeaderBackground() {
  const { isHeaderBackgroundHidden } = useHeaderContext();
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
    if (isHeaderBackgroundHidden) {
      setTopValue(-80);
      window.removeEventListener('scroll', handleScroll);
    } else {
      setTopValue(0);
      window.addEventListener('scroll', handleScroll);
    }
  }, [isHeaderBackgroundHidden]);

  return (
    <div className="header-background" style={{ top: `${topValue}px` }}></div>
  );
}

export default HeaderBackground;
