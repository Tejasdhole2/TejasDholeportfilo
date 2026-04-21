import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiGithub, FiExternalLink } from 'react-icons/fi';
import styles from './Projects.module.css';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);
    const fetchAll = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects');
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className={styles.allProjectsWrapper}>
      <div className={styles.backNav}>
        <Link to="/" className={styles.backLink}>
          <FiArrowLeft /> Back to Home
        </Link>
      </div>

      <div className={styles.container}>
        <h1 className={styles.heading}>All <span>Projects</span></h1>
        
        <div className={styles.grid}>
          {projects.map((item) => (
            <div key={item._id || item.id} className={styles.card}>
              <div className={styles.imgContainer}>
                <img src={item.image} alt={item.title} className={styles.projectImg} />
              </div>
              <div className={styles.details}>
                <div className={styles.headerRow}>
                  <h3>{item.title}</h3>
                  <span className={styles.language}>{item.language}</span>
                </div>
                <p className={styles.description}>{item.desc}</p>
                <div className={styles.links}>
                   <a href={item.link}><FiGithub /></a>
                   <a href={item.link}><FiExternalLink /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProjects;