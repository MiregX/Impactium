import React, { useState, useEffect } from 'react';
import './Preloader.css'; // Import your styles

function Preloader() {
  const [visitedBefore] = useState(localStorage.getItem("visitedBefore") === "true");

  useEffect(() => {
    const timeout = visitedBefore ? 500 : 4000;

    const removePreloader = () => {
      document.querySelector('.preloader').remove();
    };

    if (visitedBefore) {
      document.querySelector('header .logo').style.opacity = 1;
      document.querySelector('.preloader').classList.add('fast-animation');
    } else {
      document.querySelector('.preloader').classList.add('outter-animation');
      setTimeout(removePreloader, timeout);
      localStorage.setItem("visitedBefore", "true");
    }

    return () => {
      document.removeEventListener('load', removePreloader);
    };
  }, [visitedBefore]);

  return (
    <div className="preloader" style={{ zIndex: 9 }}>
      <div className="flex flex-dir-row center" style={{ gap: 16 }}>
        <svg viewBox="-11.439 -11.421 403.213 522.815" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#e8e8e8" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="15" strokeWidth="12" transform="matrix(3.130766, 0, 0, 3.130766, -102.465179, -42.383404)">
            <path
              style={{ paintOrder: 'markers', stroke: '#e8e8e8', strokeWidth: '14.0541px' }}
              d="M 101.029 151.687 C 104.583 140.367 103.311 126.12 111.702 117.729 C 125.54 103.891 145.608 96.295 150.177 77.627 C 153.035 65.951 143.679 57.123 126.238 49.704 C 95.979 38.811 65.978 27.81 36.102 16.917 M 150.838 169.855 C 120.962 158.962 90.961 147.961 60.702 137.068 C 43.261 129.649 33.905 120.821 36.763 109.145 C 41.332 90.477 61.662 82.62 75.238 69.044 C 83.63 60.652 82.357 46.405 85.911 35.085 M 36.102 16.917 L 75.094 68.892 M 111.783 117.796 L 150.838 169.855"
              className="logo-animation-first"
            ></path>
            <path
              style={{ paintOrder: 'markers', stroke: '#e8e8e8', strokeWidth: '14.0541px' }}
              d="M 125.234 51.047 C 102.473 105.997 84.364 80.48 61.201 136.4"
              className="logo-animation-second"
            ></path>
          </g>
        </svg>
        <p>Impactium</p>
      </div>
    </div>
  );
}

export default Preloader;
