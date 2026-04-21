import React from 'react';
import { FiEye, FiLayers, FiMail } from 'react-icons/fi';
import styles from './Admin.module.css';

const StatsGrid = ({ views, projCount, msgCount }) => {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <FiEye className={styles.icon} />
        <div><h3>{views}</h3><p>Total Views</p></div>
      </div>
      <div className={styles.statCard}>
        <FiLayers className={styles.icon} />
        <div><h3>{projCount}</h3><p>Projects</p></div>
      </div>
      <div className={styles.statCard}>
        <FiMail className={styles.icon} />
        <div><h3>{msgCount}</h3><p>Messages</p></div>
      </div>
    </div>
  );
};

export default StatsGrid;