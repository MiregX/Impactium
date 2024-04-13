'use client'
import s from '@/styles/Preloader.module.css'
import { useUser } from '@/context/User';
import { useHeader } from '../../context/Header';
import { useLanguage } from '@/context/Language';
import Cookies from 'universal-cookie';
import {
    useCallback,
    useEffect,
    useState,
    useRef,
  } from "react";
import { usePathname } from 'next/navigation';

export function Preloader({ applicationInfo }) {
  const cookie = new Cookies();
  const { isUserLoaded } = useUser();
  const { setIsLogoHiiden } = useHeader();
  const { lang } = useLanguage();
  const url = usePathname(); 
  const blocker = url === '/login/callback';

  const [visitedBefore, setVisitedBefore] = useState<boolean>(typeof window !== 'undefined' && !!window.localStorage.getItem('visitedBefore'));
  const self = useRef(null);

  const show = useCallback(() => {
    self.current.classList.remove(s.remove, s.hide, s.slow, s.fast);
    if (visitedBefore) {
      self.current.classList.add(s.fast);
    } else {
      setIsLogoHiiden(true);
      self.current.classList.add(s.slow);
    }
  }, [self, visitedBefore]);

  const hide = useCallback(() => {
    const opacityDelay = visitedBefore ? 300 : 3000;

    setTimeout(() => {
      self.current.classList.add(s.hide);
      setIsLogoHiiden(false);
      setTimeout(() => {
        self.current.classList.add(s.remove);
        if (!visitedBefore) setVisitedBefore(true);
      }, 200);
    }, opacityDelay);
  }, [self, visitedBefore]);  

  useEffect(() => {
    show();
    if (applicationInfo.enforced_preloader) return;
    console.log(isUserLoaded, !blocker)
    if (isUserLoaded && !blocker) {
      hide();
    } else {
      show();
    }
  }, [isUserLoaded, blocker, hide, show]);

  useEffect(() => {
    if (!visitedBefore) {
      window.localStorage.setItem('visitedBefore', String(true));
    }
  }, [visitedBefore]);

  const buildingMap = [
    {
      icon: 'https://em-content.zobj.net/thumbs/60/apple/391/whale_1f40b.webp',
      phrase: 'enforsedPhrase1'
    },
    {
      icon: 'https://em-content.zobj.net/thumbs/60/apple/391/eggplant_1f346.webp',
      phrase: 'enforsedPhrase2'
    },
    {
      icon: 'https://em-content.zobj.net/thumbs/60/apple/391/bottle-with-popping-cork_1f37e.webp',
      phrase: 'enforsedPhrase3'
    },
    {
      icon: 'https://em-content.zobj.net/thumbs/60/apple/391/brick_1f9f1.webp',
      phrase: 'enforsedPhrase4'
    },
    {
      icon: 'https://em-content.zobj.net/thumbs/60/apple/391/satellite_1f6f0-fe0f.webp',
      phrase: 'enforsedPhrase5'
    },
    {
      icon: 'https://em-content.zobj.net/thumbs/60/apple/391/magnifying-glass-tilted-left_1f50d.webp',
      phrase: 'enforsedPhrase6'
    },
    {
      icon: 'https://em-content.zobj.net/thumbs/60/apple/391/bookmark-tabs_1f4d1.webp',
      phrase: 'enforsedPhrase7'
    },
    {
      icon: 'https://em-content.zobj.net/thumbs/60/apple/391/light-bulb_1f4a1.webp',
      phrase: 'enforsedPhrase8'
    }
  ];

  useEffect(() => {
    if (applicationInfo.enforced_preloader)
      self.current.classList.add(s.dev);
  }, [self])

  const [currentSection, setCurrentSection] = useState(0);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSection(prevSection => (prevSection + 1) % buildingMap.length);
    }, 2500);
  
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className={s.preloader} ref={self}>
      <div className={s.container}>
        <div className={s.main}>
          <svg viewBox="-11.439 -11.421 403.213 522.815" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="#e8e8e8" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="15" strokeWidth="12" transform="matrix(3.130766, 0, 0, 3.130766, -102.465179, -42.383404)">
              <path
                style={{ paintOrder: 'markers', stroke: '#e8e8e8', strokeWidth: '14px' }}
                d="M 125.234 51.047 C 102.473 105.997 84.364 80.48 61.201 136.4"
                className={s.second}/>
              <path
                style={{ paintOrder: 'markers', stroke: '#e8e8e8', strokeWidth: '14px' }}
                d="M 101.029 151.687 C 104.583 140.367 103.311 126.12 111.702 117.729 C 125.54 103.891 145.608 96.295 150.177 77.627 C 153.035 65.951 143.679 57.123 126.238 49.704 C 95.979 38.811 65.978 27.81 36.102 16.917 M 150.838 169.855 C 120.962 158.962 90.961 147.961 60.702 137.068 C 43.261 129.649 33.905 120.821 36.763 109.145 C 41.332 90.477 61.662 82.62 75.238 69.044 C 83.63 60.652 82.357 46.405 85.911 35.085 M 36.102 16.917 L 75.094 68.892 M 111.783 117.796 L 150.838 169.855"
                className={s.first}/>
            </g>
          </svg>
          <p>Impactium</p>
        </div>
        <div className={s.building}>
          {buildingMap.map((section, index) => {
            const position = (index - currentSection + buildingMap.length) % buildingMap.length + 1;
            return (
              <section key={index} className={s[`p${position}`]}>
                <img src={section.icon} alt="" />
                <p>{lang.enforsedPreloader[section.phrase]}</p>
              </section>
            );
          })}
      </div>
      </div>
    </div>
  );
};

