import React from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import styles from './Hero.module.css';
import profileImg from '../../Asset/TejasDhole5.png';

const Hero = () => {
  // Smooth scroll function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className={styles.hero}>
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={styles.content}
      >
        <h2 className={styles.intro}>Hi, I'm Tejas</h2>
        <h1 className={styles.mainTitle}>
          Building Digital <br/>
          <span>Experiences</span>
        </h1>
        
        <div className={styles.typewriter}>
          <Typewriter 
            words={['Full Stack Developer', 'UI/UX Designer', 'Solution Architect']} 
            loop={0} 
            cursor 
            cursorStyle="_"
          />
        </div>

        {/* Updated Button Group with Scroll Logic */}
        <div className={styles.btnGroup}>
          <button 
            className={styles.primaryBtn} 
            onClick={() => scrollToSection('projects')}
          >
            View Projects
          </button>
          <button 
            className={styles.secondaryBtn} 
            onClick={() => scrollToSection('contact')}
          >
            Contact Me
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className={styles.imageWrapper}
      >
        <div className={styles.glowCard}>
          <img 
            src={profileImg}
            alt="Profile" 
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;