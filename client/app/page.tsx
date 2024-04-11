'use client'
import styles from '@/styles/Index.module.css';
import { AboutUs } from '@/components/main/hosting/AboutUs';
import { Cloud } from '@/components/main/hosting/Cloud';
import { Challenge } from '@/components/main/hosting/Challenge';

export default function Main() {
 
  return (
    <div className={styles.panel}>
      {/* <AboutUs /> */}
      <Challenge />
      <Cloud />
    </div>
  );
};