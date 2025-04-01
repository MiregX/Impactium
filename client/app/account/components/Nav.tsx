'use client'
import { useLanguage } from "@/context/Language.context";
import Link from "next/link";
import s from '../Account.module.css';
import { useEffect, useState } from "react";
import { Locale } from "@/public/locale";

export function Nav() {
  const { lang } = Language.use();
  const [activeSection, setActiveSection] = useState('');
  const sections: (keyof Locale['account'])[] = ['avatar', 'balance', 'displayName', 'username', 'email', 'connections'];

  useEffect(() => {
    const yOffset = -192;

    const handleClick = (e: any) => {
      e.preventDefault();
      const id = e.target.getAttribute('href').slice(1);
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        window.history.pushState(null, '', `#${id}`);
      }
    };

    const handleScroll = () => {
      let currentSection = '';
      sections.forEach(id => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top + yOffset <= 0) {
          currentSection = id;
        }
      });
      setActiveSection(currentSection);
    };

    document.querySelectorAll('nav a').forEach(anchor => anchor.addEventListener('click', handleClick));
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      document.querySelectorAll('nav a').forEach(anchor => anchor.removeEventListener('click', handleClick));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={s.nav}>
      {sections.map(section => (
        <Link key={section} href={`#${section}`} className={activeSection === section ? s.active : ''}>
          {lang.account[section]}
        </Link>
      ))}
    </nav>
  );
}
