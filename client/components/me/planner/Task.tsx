import React, { useEffect, useState } from "react";
import styles from "@/styles/me/Planner.module.css";

export function Task({ task, active, index, setActive, setTasks, tasks }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => console.log(active), [active]);

  const handleChange = (event) => {
    const { value } = event.target;
    setTasks((oldTasks) => {
      return oldTasks.map((taskItem) => {
        if (taskItem.id === task.id) {
          return { ...taskItem, title: value };
        }
        return taskItem;
      });
    });
  };

  return (
    <div className={styles.task} key={task.id}>
      <div className={styles.description}>
        {isEditing ? (
          <input type="text"
            className={styles.inputText}
            value={task.title}
            onChange={handleChange}
          />
        ) : (
          <div onClick={() => setIsCompleted(!isCompleted)}>
            <div className={`${styles.checkBox} ${task.isCompleted && styles.completed}`}></div>
            <p className={styles.changeTaskName}>{task.title}</p>
          </div>
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.status}>
          <span className={styles.span}>
            {task.status >= 200
              ? 'Заебись'
              : (task.status >= 400
                ? 'Такое себе'
                : 'Полная хуйня')
            }
          </span>
          <div className={styles.color}>•</div>
        </div>
        <button>
          <div onClick={() => setActive(index)} className={styles.pointer}>
            <img src="https://www.svgrepo.com/show/532954/grip-dots-vertical.svg" alt="" />
          </div>
          <div className={`${styles.hoverTask} ${active === index ? styles.active : ''}`}>
            <div className={styles.selectStatus} onClick={() => setActive(-1)}>
              <p> Закрыть</p>
            </div>
            <div className={styles.selectStatus} onClick={() => setIsEditing(!isEditing)}>
              <p>{isEditing ? 'Сохранить' : 'Редактировать'}</p>
            </div>
            <div className={styles.selectStatus}>
              <p>Удалить</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};