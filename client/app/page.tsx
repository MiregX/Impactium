'use client'
import styles from '@/styles/Index.module.css';
import AboutUsTextBlock from '@/components/main/AboutUs'; 
import PrivilegesList from '@/components/main/Privileges';

export default function Main() {
 
  return (
    <div className={styles.panel}>
      <div className={styles.aboutUs}>
        <AboutUsTextBlock /> 
      </div>
      <PrivilegesList />
    </div>
  );
};