import React from 'react';
import axios from 'axios';
import { FiTrash2 } from 'react-icons/fi';
import styles from './Admin.module.css';

const MessageInbox = ({ messages, refresh }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Delete message?")) {
      await axios.delete(`http://localhost:5000/api/messages/${id}`);
      refresh();
    }
  };

  return (
    <div className={styles.inboxSection}>
      <h2>Inbox</h2>
      <div className={styles.msgGrid}>
        {messages.map((msg) => (
          <div key={msg._id} className={styles.msgCard}>
            <div className={styles.msgHeader}>
              <strong>{msg.name}</strong>
              <button onClick={() => handleDelete(msg._id)}><FiTrash2 /></button>
            </div>
            <p>{msg.email}</p>
            <p className={styles.msgText}>{msg.message}</p>
            <small>{new Date(msg.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageInbox;