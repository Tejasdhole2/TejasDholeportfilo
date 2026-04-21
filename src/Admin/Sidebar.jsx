import React from 'react';
import { FiBarChart2, FiLayers, FiMail, FiUser } from 'react-icons/fi'; // Added FiUser
import styles from './Admin.module.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <FiBarChart2 /> },
    { id: 'projects', label: 'Projects', icon: <FiLayers /> },
    { id: 'profile', label: 'Profile', icon: <FiUser /> }, // New Profile Tab
    { id: 'messages', label: 'Messages', icon: <FiMail /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>ADMIN<span>.</span></div>
      <nav className={styles.navLinks}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navBtn} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;