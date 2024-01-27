import React, { useEffect } from 'react';
import { useLanguage } from '../language/Lang';
import { useHeaderContext } from '../header/HeaderContext';
import './Main.css';

const Main = () => {
  const { setIsHeaderBackgroundHidden } = useHeaderContext();
  const { lang } = useLanguage();

  useEffect(() => {
    const header = document.querySelector('header');
    const gl = document.querySelector('.right');
    const aboutUsMainText = document.querySelector('.main-text');
    const aboutUsDescriptionText = document.querySelector('.descriptions-wrapper');
    setTimeout(() => {
      header.style.transform = 'translateY(0px)';
      header.style.opacity = '1';
      gl.style.transform = 'translateX(0px)';
      gl.style.opacity = '1';
      aboutUsMainText.style.transform = 'translateX(0px)';
      aboutUsMainText.style.opacity = '1';
      aboutUsDescriptionText.style.transform = 'translateX(0px)';
      aboutUsDescriptionText.style.opacity = '1';
    }, 400);
  
    const lis = document.querySelectorAll('.privileges li');
    lis.forEach((li, index) => {
      setTimeout(() => {
        li.classList.add('width-100');
      }, (index + 1) * 250);
    });
  
    const descriptionBlocksAnimationInit = (currentIndex) => {
      const descriptionBlocks = document.querySelectorAll('.descriptions-wrapper .support-text');
  
      descriptionBlocks.forEach((block, index) => {
        block.classList.remove('on-move', 'active');
  
        if (index === currentIndex) {
          block.classList.add('active');
        } else if (index === ((currentIndex === 0) ? descriptionBlocks.length - 1 : currentIndex - 1)) {
          block.classList.add('on-move');
        }
      });
  
      currentIndex = (currentIndex + 1) % descriptionBlocks.length;
  
      // Проверяем, завершилась ли анимация, прежде чем вызывать следующую
      setTimeout(() => {
        descriptionBlocksAnimationInit(currentIndex);
      }, 4000);
    };
  
    // Запускаем анимацию только один раз
    descriptionBlocksAnimationInit(1);
  }, []);

  useEffect(() => {
    setIsHeaderBackgroundHidden(true);

    return () => {
      setIsHeaderBackgroundHidden(false);
    };
  }, [setIsHeaderBackgroundHidden]);
  
  return (
    <div className="panel">
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
          <li hammer="">{lang.administrationNotIntervenes}<hr /></li>
          <li casual="">{lang.openWorldWithoutPrivates}<hr /></li>
          <li defence="">{lang.sendAthletesAgainstNonRP}<hr /></li>
          <li killer="">{lang.uniqueRewardsSystem}<hr /></li>
          <li event="">{lang.masterpieceRoleplayWithAdmins}<hr /></li>
          <li donate="">{lang.donateAndGetUniqueSkin}<hr /></li>
        </ul>
        <a href="https://impactium.fun/me/minecraft">
          {lang.myProfile}
        </a>
      </div>
    </div>
  );
};

export default Main;
