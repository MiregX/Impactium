import React, { useEffect, useState } from 'react';
import './HeaderBackground.css';

function HeaderBackground() {
  const [isHidden, setIsHidden] = useState(false); // нужно передать в header
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
    if (isHidden) {
      setTopValue(-80);
      window.removeEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }
  }, [isHidden]);

  return (
    <div className="header-background" style={{ top: `${topValue}px` }}></div>
  );
}

export default HeaderBackground;
