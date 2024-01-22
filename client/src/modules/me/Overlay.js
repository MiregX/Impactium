import React, { useEffect, useRef } from 'react';
import './Overlay.css'; // Replace with your actual CSS file
import { usePlayer } from '../../class/Player';

const Overlay = () => {
  const overlayRef = useRef(null);
  const { player } = usePlayer(null);

  useEffect(() => {
    let panel;
    let liners;
    let overlay;

    const initCards = () => {
      updateSelectors();
      const cards = Array.from(document.querySelectorAll(".dynamic"));

      liners.forEach(line => {
        const lineDuplicate = document.createElement("div");
        lineDuplicate.classList.add(...line.classList);

        const parentCalcOverlay = line.querySelector(".calc_overlay");
        if (parentCalcOverlay) {
          const calcOverlay = document.createElement("div");
          calcOverlay.classList.add(...parentCalcOverlay.classList);
          line.querySelectorAll('.dynamic').forEach(parentCard => {
            const card = createCard(parentCard);
            const conteiner = parentCard.closest('.calc_overlay')
            if (conteiner) {
              calcOverlay.appendChild(card);
            } else {
              lineDuplicate.appendChild(card);
            }
          });
          lineDuplicate.appendChild(calcOverlay);
        } else {
          line.querySelectorAll('.dynamic').forEach(parentCard => {
            const card = createCard(parentCard);
            lineDuplicate.appendChild(card);
          });
        }

        overlay.appendChild(lineDuplicate);
      });

      cards.forEach(cardElement => {
        observer.observe(cardElement);
      });

      // Добавьте слушатели только при инициализации
      if (window.matchMedia("(max-width: 768px)").matches) {
        window.addEventListener("scroll", applyOverlayMaskOnCenter);
      } else {
        document.body.addEventListener("pointermove", applyOverlayMask);
      }
    };

    const createCard = (cardElement) => {
      const overlayCard = document.createElement("div");
      overlayCard.classList.add(...cardElement.classList);
      const toOverlayViewElement = cardElement.querySelectorAll('[tooverlayview]');
      if (toOverlayViewElement) {
        toOverlayViewElement.forEach(element => {
          createOverlayCta(overlayCard, element);
        });
      }
      return overlayCard;
    };

    const updateSelectors = () => {
      panel = document.querySelector(".profile");
      liners = document.querySelectorAll(".liner");
      overlay = overlayRef.current;
    };

    const createOverlayCta = (overlayCard, buttonEl) => {
      const overlayCta = buttonEl.cloneNode(true);
      overlayCta.setAttribute("aria-hidden", true);
      overlayCard.appendChild(overlayCta);
    };

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const cardElement = entry.target;
        const cardClasses = Array.from(cardElement.classList).join('.');

        let width = entry.borderBoxSize[0].inlineSize;
        let height = entry.borderBoxSize[0].blockSize;
        const overlayCards = overlay.querySelectorAll(`.${cardClasses}`);
        overlayCards.forEach((overlayCard) => {
          overlayCard.style.width = `${width}px`;
          overlayCard.style.height = `${height}px`;
        });
      });
    });

    const applyOverlayMaskOnCenter = (e) => {
      const x = window.innerWidth * 0.5 + window.scrollX;
      const y = window.innerHeight * 0.5 + window.scrollY;

      overlay.style.setProperty("--opacity", "1");
      overlay.style.setProperty("--x", `${x}px`);
      overlay.style.setProperty("--y", `${y}px`);
    };

    const applyOverlayMask = (e) => {
      const overlayEl = e.currentTarget;
      const x = e.pageX - panel.offsetLeft;
      const y = e.pageY - panel.offsetTop;
      overlayEl.style = `--opacity: 1; --x: ${x}px; --y:${y}px;`;
    };

    initCards();

    return () => {
      window.removeEventListener("scroll", applyOverlayMaskOnCenter);
      document.body.removeEventListener("pointermove", applyOverlayMask);

      // Удалите все созданные блоки
      overlay.innerHTML = "";
    };
  }, [player]);

  return (
    <div className="overlay flex" ref={overlayRef} style={{ gap: '32px' }}>
      {/* Render additional React components as needed */}
    </div>
  );
};

export default Overlay;
