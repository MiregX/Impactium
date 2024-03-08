'use client'
import React, { useState, useEffect } from 'react';
import styles from '@/styles/me/Planner.module.css';

export default function PlannerPage() {
  
  const taskDescription = [1,2,3,4,5,6,7,8,9,10];
  const [hoverPanelDisplays, setHoverPanelDisplays] = useState(Array(10).fill("none"));
  const [selectedStatuses, setSelectedStatuses] = useState(Array(10).fill('')); 
  const [statusPositions, setStatusPositions] = useState(Array(10).fill(0));
  const [colorStatus, setColorStatus] = useState(Array(10).fill('white')); 
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    const newTask = { id: tasks.length, status: '', description: taskDescription[tasks.length % taskDescription.length] };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
  }

  function removeLastTask() {
    if (tasks.length > 0) {
      const newTasks = [...tasks];
      newTasks.pop(); 
      setTasks(newTasks);
    }
  }
  
  function handleButtonClick(index) {
    const newHoverPanelDisplays = hoverPanelDisplays.map((display, i) => (i === index ? "flex" : "none"));
    setHoverPanelDisplays(newHoverPanelDisplays);
    const newStatusPositions = Array(10).fill(0); 
    newStatusPositions[index] = 40; 
    setStatusPositions(newStatusPositions);
  }
  
  function handleStatusSelection(index, status) {
    if (status === '') {
      return; 
    }
    const newSelectedStatuses = [...selectedStatuses];
    newSelectedStatuses[index] = status;
    setSelectedStatuses(newSelectedStatuses);
  
    const newColorStatus = [...colorStatus];
    if (status === '1') {
      newColorStatus[index] = 'green';
    } else if (status === '2') {
      newColorStatus[index] = 'red';
    } else if (status === '') {
        
    } else {
      newColorStatus[index] = 'white';
    }
  
    setColorStatus(newColorStatus);
    localStorage.setItem('colorStatus', JSON.stringify(newColorStatus));
  }
  
  function handleHideHoverTask() {
    setHoverPanelDisplays(Array(10).fill("none"));
    setStatusPositions(Array(10).fill(0));
  }
  
  return (
    <div className={styles.planner}>
      {tasks.map((task, index) => (
        <div className={styles.task} key={task.id}>
          <div className={styles.description}>
            <span className={styles.span}>{task.description}</span>
          </div>
          <div 
            className={styles.status}
            style={{ right: `${statusPositions[index]}px` }}
          >
            <span className={styles.span}>Status: {selectedStatuses[index]}</span>
            <div className={styles.color} style={{ color: colorStatus[index] }}>•</div> 
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
              <div onClick={() => handleStatusSelection(index, '1')}>: 1</div>
            </div>
            <div className={styles.selectStatus}>
              <div onClick={() => handleStatusSelection(index, '2')}>: 2</div>
            </div>
            <div className={styles.selectStatus} onClick={handleHideHoverTask}>
              <div>: быть</div>
            </div>
          </div>
        </div>
      ))}
      <button className={styles.addtasks} onClick={addTask}>Добавить задачу</button>
      <button className={styles.removetask} onClick={removeLastTask}>Убрать последнюю задачу</button>
    </div>
  );
}  