'use client'
import React, { useState, useEffect } from 'react';
import { Task } from '@/components/me/planner/Task'
import styles from '@/styles/me/Planner.module.css';

export default function PlannerPage() {
  const tasksFromLocalStorage = localStorage.getItem('tasks');
  if (typeof tasksFromLocalStorage === 'number') {
    localStorage.removeItem('tasks');
  }
  const [tasks, setTasks] = useState(tasksFromLocalStorage ? JSON.parse(tasksFromLocalStorage) : []);
  const [active, setActive] = useState(null);
  console.log(tasks);

  useEffect(() => localStorage.setItem('tasks', JSON.stringify(tasks)), [tasks])

  const addTask = () => {
    const newTask = {
      id: tasks.length + 1,
      status: 200,
      title: 'SOMETHING'
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
          tasks={tasks}
          active={active}
          setActive={setActive}
          task={task}
          setTasks={setTasks}
          index={index}
          />
      ))}

      <button className={styles.addtasks} onClick={addTask}>Добавить задачу</button>
      <button className={styles.removetask} onClick={removeLastTask}>Убрать последнюю задачу</button>
    </div>
  );
}