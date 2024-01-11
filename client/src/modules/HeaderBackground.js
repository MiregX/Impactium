import React, { useEffect, useState } from 'react';
import './HeaderBackground.css';

function HeaderBackground() {
  const [topValue, setTopValue] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newTopValue = Math.max(-80, Math.min(0, -80 + scrollY));
      setTopValue(newTopValue);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const logo = document.querySelector('.logo');
    logo.classList.add('inner-animation');
  }, []);

  return (
    <div className="header-background" style={{ top: `${topValue}px` }}>
      {/* Ваш JSX-код */}
    </div>
  );
}

export default HeaderBackground;
