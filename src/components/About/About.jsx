import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./About.module.css";

const About = () => {
  const [data, setData] = useState({ description: "", resumeFile: "" });

  useEffect(() => {
    // Fetch only the description and the server-hosted file path
    axios.get('http://localhost:5000/api/about').then(res => setData(res.data));
  }, []);

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        
        {/* BIO TEXT */}
        <motion.div 
          className={styles.textSide}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2 className={styles.title}>About <span>Me</span></h2>
          <p className={styles.fullDescription}>{data.description}</p>
          
          {/* Only show button if a file has been uploaded to your server */}
          {data.resumeFile && (
            <a href={data.resumeFile} target="_blank" rel="noreferrer" className={styles.ctaButton}>
              Download CV
            </a>
          )}
        </motion.div>

        {/* RESUME PREVIEW */}
        <motion.div 
          className={styles.resumeSide}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className={styles.resumeFrame}>
            {data.resumeFile ? (
              <iframe 
                src={data.resumeFile} 
                className={styles.iframe}
                title="Resume Preview"
                /* These attributes help with PDF rendering */
                type="application/pdf"
              ></iframe>
            ) : (
              <div className={styles.placeholder}>
                <p>No Resume Uploaded.</p>
                <span>Please upload a PDF in the Admin Dashboard to see the preview here.</span>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;