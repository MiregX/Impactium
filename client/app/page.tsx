'use client'
import styles from '@/styles/Index.module.css';
import AboutUsTextBlock from '@/components/main/hosting/AboutUs';
import { Cloud } from '@/components/main/hosting/Cloud';

export default function Main() {
 
  return (
    <div className={styles.panel}>
      <div className={styles.aboutUs}>
        <AboutUsTextBlock />
      </div>
        <Cloud />
    </div>
  );
};