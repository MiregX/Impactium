import React, { useEffect, useState } from 'react';
import { useLanguage } from './../Lang';
import { useUser } from '../../class/User';
import './Main.css'; // Import your styles

const Main = () => {
  const { lang } = useLanguage();
  const { user } = useUser();
  const [currentIndex, setCurrentIndex] = useState(1);

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
    
    const descriptionBlocksAnimationInit = () => {
      const descriptionBlocks = document.querySelectorAll('.descriptions-wrapper .support-text');

      descriptionBlocks.forEach((block, index) => {
        block.classList.remove('on-move', 'active');

        if (index === currentIndex) {
          block.classList.add('active');
        } else if (index === ((currentIndex === 0) ? descriptionBlocks.length - 1 : currentIndex - 1)) {
          block.classList.add('on-move');
        }
      });

      setCurrentIndex((prevIndex) => (prevIndex + 1) % descriptionBlocks.length);
    };

    const animationInterval = setInterval(descriptionBlocksAnimationInit, 4000);
    descriptionBlocksAnimationInit();

    return () => clearInterval(animationInterval);
  }, []);
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
          <li hammer="">{lang.administrationNotIntervenes}<hr /></li>
          <li casual="">{lang.openWorldWithoutPrivates}<hr /></li>
          <li defence="">{lang.sendAthletesAgainstNonRP}<hr /></li>
          <li killer="">{lang.uniqueRewardsSystem}<hr /></li>
          <li event="">{lang.masterpieceRoleplayWithAdmins}<hr /></li>
          <li donate="">{lang.donateAndGetUniqueSkin}<hr /></li>
        </ul>
        <a href="https://impactium.fun/me/minecraft">
          {user.id ? lang.myProfile : lang.register}
        </a>
      </div>
    </div>
  );
};

export default Main;
