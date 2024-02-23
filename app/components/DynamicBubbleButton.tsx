import styles from '@/styles/Header.module.css';
import { lang } from '@/context/Language';

interface IDynamicBubbleButton {
  type: "login" | "logout";
}

export default function DynamicBubbleButton({ type }: IDynamicBubbleButton) {
  return (
    <button className={styles.dynamicBubbleButton}>
      <div className={styles.circle}>
        <svg className={styles.arrow} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
          <path d="M18 12H18M18 12L13 7M18 12L13 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className={styles.buttonText}>{lang[type]}</p>
    </button>
  );
}
