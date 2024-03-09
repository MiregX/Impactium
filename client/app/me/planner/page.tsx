'use client'
import React, { useState, useEffect } from 'react';
import { Task } from '@/components/me/planner/Task'
import styles from '@/styles/me/Planner.module.css';

export default function PlannerPage() {
  
  const tasksMap = [
    {
      title: 'Таска один',
      desription: "Залупа",
      status: 200
    }, 
    {
      title: 'Таска два',
      desription: "Пенис",
      status: 400
    },
    {
      title: 'Таска три',
      desription: "Хер",
      status: 500
    }
  ]

  const taskDescription = [1,2,3,4,5,6,7,8,9,10];
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : tasksMap;
  });

  const [active, setActive] = useState(null);

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
  
  return (
    <div className={styles.planner}>
      {tasks.map((task, index) => (
        <Task
          active={active}
          setActive={setActive}
          task={task}
          index={index} />
      ))}

      <button className={styles.addtasks} onClick={addTask}>Добавить задачу</button>
      <button className={styles.removetask} onClick={removeLastTask}>Убрать последнюю задачу</button>
    </div>
  );
}