import React, { useEffect } from 'react';
import { useLanguage } from './Lang';
import { useUser } from '../class/User';
import './Main.css'; // Import your styles

const Main = () => {
  const { lang } = useLanguage();
  const { user } = useUser();

  useEffect(() => {
    // Animation for header
    const header = document.querySelector('header');
    header.style.transform = 'translateY(0px)';
    header.style.opacity = '1';

    // Animation for the right panel
    const gl = document.querySelector('.right');
    gl.style.transform = 'translateX(0px)';
    gl.style.opacity = '1';

    // Animation for about us main text
    const aboutUsMainText = document.querySelector('.main-text');
    aboutUsMainText.style.transform = 'translateX(0px)';
    aboutUsMainText.style.opacity = '1';

    // Animation for about us description text
    const aboutUsDescriptionText = document.querySelector('.descriptions-wrapper');
    aboutUsDescriptionText.style.transform = 'translateX(0px)';
    aboutUsDescriptionText.style.opacity = '1';

    // Animation for privileges list
    const lis = document.querySelectorAll('.privileges li');
    lis.forEach((li) => {
      li.style.width = '100%';
    });

    // Text description animation
    const descriptionBlocks = document.querySelectorAll('.descriptions-wrapper .support-text');
    let currentIndex = 1;
    console.log(descriptionBlocks)
 
    descriptionBlocks.forEach((block, index) => {
      block.classList.remove('on-move', 'active');

      if (index === currentIndex) {
        block.classList.add('active');
      } else if (index === ((currentIndex === 0) ? descriptionBlocks.length - 1 : currentIndex - 1)) {
        block.classList.add('on-move');
      }
    });

    currentIndex = (currentIndex + 1) % descriptionBlocks.length;
  }, []); // Run this effect only once on mount
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
