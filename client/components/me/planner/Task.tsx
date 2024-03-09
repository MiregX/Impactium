import React, { useEffect, useState } from "react"
import styles from "@/styles/me/Planner.module.css";

export function Task({task, active, index, setActive}) {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => console.log(isActive), [isActive])

  return (
    <div className={styles.task} key={task.id}>
      <div className={styles.description}>
        <span className={styles.span}>{task.description}</span>
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
        <button onClick={() => setActive(index)}>
          <img src="https://www.svgrepo.com/show/532954/grip-dots-vertical.svg" alt="" />
          <div className={`${styles.hoverTask} ${active === index && styles.active}`}>
            <div className={styles.selectStatus}>
              <p>Закрыть</p>
            </div>
            <div className={styles.selectStatus}>
              <p>Редактировать</p>
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