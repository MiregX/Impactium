'use client'
import React, { useState, useEffect } from 'react';
import { Task } from '@/components/me/planner/Task';
import styles from '@/styles/me/Planner.module.css';

export default function PlannerPage() {
  const tasksFromLocalStorage = localStorage.getItem('tasks');
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);

  const textsToIterate = [
    'Привет!',
    'Я Олег.',
    'Хочу сказать, что ТимЛид ЛОХ!!!'
  ];
  const interval = 100;
  let changeInterval = 1000; 

  useEffect(() => {
    let index = 0;
    const textLength = textsToIterate[textIndex].length;

    const displayTextInterval = setInterval(() => {
      if (index < textLength) {
        setDisplayText((prevText) => prevText + textsToIterate[textIndex].charAt(index));
        index++;
      } else {
        clearInterval(displayTextInterval);
        // Здесь устанавливаем новый интервал после появления динамического текста
        const changeTextTimeout = setTimeout(() => {
          setTextIndex((prevIndex) => (prevIndex + 1) % textsToIterate.length);
          setDisplayText(''); 
          changeInterval = 1000; 
        }, changeInterval);
      }
    }, interval);

    return () => clearInterval(displayTextInterval);
  }, [textIndex]);

  useEffect(() => {
    setDisplayText(textsToIterate[textIndex].charAt(0));
  }, [textIndex]);

  if (typeof tasksFromLocalStorage === 'number') {
    localStorage.removeItem('tasks');
  }

  const [tasks, setTasks] = useState(tasksFromLocalStorage ? JSON.parse(tasksFromLocalStorage) : []);
  const [active, setActive] = useState(null);

  useEffect(() => localStorage.setItem('tasks', JSON.stringify(tasks)), [tasks]);

  const addTask = () => {
    const newTask = {
      id: tasks.length + 1,
      status: 200,
      title: 'SOMETHING',
    };

    setTasks((oldTasks) => [...oldTasks, newTask]);
  };

  function removeLastTask() {
    setTasks((oldTasks) => {
      const updatedTasks = oldTasks.slice(0, -1);
      return updatedTasks;
    });
  }

  return (
    <div className={styles.planner}>
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          tasks={tasks}
          active={active}
          setActive={setActive}
          task={task}
          setTasks={setTasks}
          index={index}
        />
      ))}

      <button className={styles.addtasks} onClick={addTask}>
        Добавить задачу
      </button>
      <button className={styles.removetask} onClick={removeLastTask}>
        Убрать последнюю задачу
      </button>

      <div className={styles.dynamicText}>{displayText}</div>
    </div>
  );
}