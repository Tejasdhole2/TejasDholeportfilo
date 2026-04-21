import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  // 👁️ Track Website View: Increments when someone lands on the page
  useEffect(() => {
    const trackView = async () => {
      try {
        await axios.post('http://localhost:5000/api/stats/visit');
      } catch (err) {
        console.error("View tracking failed", err);
      }
    };
    trackView();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      // 📨 Send message to backend
      await axios.post('http://localhost:5000/api/messages', formData);
      setStatus('Message Sent Successfully!');
      setFormData({ name: '', email: '', message: '' }); // Clear form
    } catch (err) {
      setStatus('Failed to send message.');
    }
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.glassContainer}>
        <h2>Get In <span>Touch</span></h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Your Name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
          <textarea 
            placeholder="Your Message" 
            rows="5" 
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            required
          ></textarea>
          <button type="submit">Send Message</button>
          {status && <p className={styles.statusMsg}>{status}</p>}
        </form>
      </div>
    </section>
  );
};

export default Contact;