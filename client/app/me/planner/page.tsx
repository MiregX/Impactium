'use client'
import React, { useState } from 'react';
import styles from '@/styles/me/Planner.module.css';

export default function PlannerPage() {
  const [hoverPanelDisplays, setHoverPanelDisplays] = useState(Array(8).fill("none"));
  const [selectedStatuses, setSelectedStatuses] = useState(Array(8).fill('')); 
  const [statusPositions, setStatusPositions] = useState(Array(8).fill(0));

  function handleButtonClick(index) {
    const newHoverPanelDisplays = hoverPanelDisplays.map((display, i) => (i === index ? "flex" : "none"));
    setHoverPanelDisplays(newHoverPanelDisplays);
    const newStatusPositions = Array(8).fill(0); 
    newStatusPositions[index] = 135; 
    setStatusPositions(newStatusPositions);
  }
  
  function handleStatusSelection(index, status) {
    const newSelectedStatuses = [...selectedStatuses];
    newSelectedStatuses[index] = status;
    setSelectedStatuses(newSelectedStatuses);
    if (status === '') {
      setHoverPanelDisplays(Array(8).fill("none"));
      setStatusPositions(Array(8).fill(0));
    }
  }

  return (
    <div className={styles.planner}>
      {[...Array(8)].map((_, index) => (
        <div className={styles.task} key={index}>
          <div 
            className={styles.status}
            style={{ right: `${statusPositions[index]}px` }}
          >
            <span className={styles.span}>Status: {selectedStatuses[index]}</span>
          </div>
          <button onClick={() => handleButtonClick(index)}> 
            <div className={styles.img}>
              <img src="https://www.svgrepo.com/show/532954/grip-dots-vertical.svg" alt="помогите" />
            </div>
          </button>
          <div 
            className={styles.hoverTask} 
            onClick={(e) => e.stopPropagation()}
            style={{ display: hoverPanelDisplays[index] }}
          >
            <div className={styles.selectStatus}>
              <div onClick={() => handleStatusSelection(index, 'я забыл')}>: я забыл</div>
            </div>
            <div className={styles.selectStatus}>
              <div onClick={() => handleStatusSelection(index, 'что здесь должно')}>: что здесь должно</div>
            </div>
            <div className={styles.selectStatus}>
              <div onClick={() => handleStatusSelection(index, '')}>: быть</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}