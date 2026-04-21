import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom'; 
import styles from './Projects.module.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    };
    loadProjects();
  }, []);

  // Show only top 3 projects
  const featuredProjects = projects.slice(0, 3);

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Featured <span>Works</span></h2>

        <div className={styles.grid}>
          {featuredProjects.map((item) => (
            <motion.div 
              key={item._id || item.id} 
              className={styles.card} 
              whileHover={{ y: -10 }}
            >
              <div className={styles.imgContainer}>
                <img 
                  src={item.image || 'https://via.placeholder.com/400x250'} 
                  alt={item.title} 
                  className={styles.projectImg} 
                />
              </div>
              <div className={styles.details}>
                <div className={styles.headerRow}>
                  <h3>{item.title}</h3>
                  <span className={styles.language}>{item.language}</span>
                </div>
                <p className={styles.description}>{item.desc}</p>
                <div className={styles.tags}>
                  {item.tech?.map((t, i) => <span key={i} className={styles.tag}>{t}</span>)}
                </div>
                <div className={styles.footer}>
                   <div className={styles.links}>
                      <a href={item.link} target="_blank" rel="noreferrer"><FiGithub /></a>
                      <a href={item.link} target="_blank" rel="noreferrer"><FiExternalLink /></a>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Use the string path "/projects" here */}
        <Link to="/projects" className={styles.viewMoreBtn}>
           View All Projects <FiArrowRight style={{ marginLeft: '10px' }} />
        </Link>
      </div>
    </section>
  );
};

export default Projects;