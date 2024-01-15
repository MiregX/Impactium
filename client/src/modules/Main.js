import React, { useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { useLanguage } from './Lang';
import { useUser } from '../class/User';
import './Main.css'; // Import your styles

const Main = () => {
  const { lang } = useLanguage();
  const { user } = useUser();
  const currentIndexRef = useRef(1);
  const descriptionBlocksRef = useRef([]);

  useLayoutEffect(() => {
    // Update the descriptionBlocksRef when the component mounts or descriptionBlocks changes
    descriptionBlocksRef.current = Array.from(document.querySelectorAll('.descriptions-wrapper .support-text'));
  }, []); // Empty dependency array to run once on mount

  const applyStyle = useCallback(() => {
    descriptionBlocksRef.current.forEach((block, index) => {
      block.classList.remove('on-move', 'active');
    });

    const currentBlock = descriptionBlocksRef.current[currentIndexRef.current];
    const prevIndex = (currentIndexRef.current === 0) ? descriptionBlocksRef.current.length - 1 : currentIndexRef.current - 1;
    const prevBlock = descriptionBlocksRef.current[prevIndex];

    if (currentBlock) {
      currentBlock.classList.add('active');
    }

    if (prevBlock) {
      prevBlock.classList.add('on-move');
    }

    currentIndexRef.current = (currentIndexRef.current + 1) % descriptionBlocksRef.current.length;

    setTimeout(() => {
      applyStyle();
    }, 5000);
  }, []);

  useLayoutEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      header.style.transform = 'translateY(0px)';
      header.style.opacity = '1';
    }

    const gl = document.querySelector('.right');
    if (gl) {
      gl.style.transform = 'translateX(0px)';
      gl.style.opacity = '1';
    }

    const aboutUsMainText = document.querySelector('.main-text');
    if (aboutUsMainText) {
      aboutUsMainText.style.transform = 'translateX(0px)';
      aboutUsMainText.style.opacity = '1';
    }

    const aboutUsDescriptionText = document.querySelector('.descriptions-wrapper');
    if (aboutUsDescriptionText) {
      aboutUsDescriptionText.style.transform = 'translateX(0px)';
      aboutUsDescriptionText.style.opacity = '1';
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const lis = document.querySelectorAll('.privileges li');

      lis.forEach((li, index) => {
        setTimeout(() => {
          li.classList.add('width-100');
        }, (index + 1) * 250);
      });
    }, 800);
  }, []);

  useEffect(() => {
    applyStyle();
  }, [applyStyle]);

  return (
    <div className="panel main">
      <div className="about-us">
        <div className="center flex-dir-column">
          <p className="main-text">{lang.joinToUs}</p>
          <div className="descriptions-wrapper flex flex-dir-column align-center">
            {lang.joinToUsDescription.length > 3 && lang.joinToUsDescription.map((text, index) => (
              <p key={index} className="support-text">{text}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="right flex-dir-column">
        <div className="background-wrapper">
          <img className="diamond background" src="https://api.impactium.fun/ui/diamond-full-pattern.svg" alt="Diamond" />
          <img className="mireg background" src="https://api.impactium.fun/ui/mireg_with_shield.png" alt="Mireg" />
        </div>
        <h2>{lang.playOnOurProject}</h2>
        <ul className="privileges">
          <li>--hammer {lang.administrationNotIntervenes}<hr /></li>
          <li>--casual {lang.openWorldWithoutPrivates}<hr /></li>
          <li>--defence {lang.sendAthletesAgainstNonRP}<hr /></li>
          <li>--killer {lang.uniqueRewardsSystem}<hr /></li>
          <li>--event {lang.masterpieceRoleplayWithAdmins}<hr /></li>
          <li>--donate {lang.donateAndGetUniqueSkin}<hr /></li>
        </ul>
        <a href="https://impactium.fun/me/minecraft">
          {user.id ? lang.myProfile : lang.register}
        </a>
      </div>
    </div>
  );
};

export default Main;
