import React, { useState, useEffect } from 'react';
import { FiX, FiUploadCloud } from 'react-icons/fi';
import styles from './Admin.module.css';
import API from './utils/api';

const ProjectForm = ({ existingProject, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    tech: '',
    link: '',
    language: ''
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingProject) {
      setFormData({
        title: existingProject.title || '',
        desc: existingProject.desc || '',
        tech: existingProject.tech?.join(', ') || '',
        link: existingProject.link || '',
        language: existingProject.language || ''
      });
      setPreview(existingProject.image);
    }
  }, [existingProject]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    if (image) {
      data.append("image", image);
    }

    try {
      if (existingProject) {
        await API.put(`/projects/${existingProject._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await API.post(`/projects`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      await onRefresh();
      onClose();

    } catch (error) {
      console.error(error);
      alert("Error saving project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{existingProject ? 'Update' : 'Add'} Project</h3>
          <button onClick={onClose} className={styles.closeIconBtn}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.adminForm}>
          <div className={styles.formGrid}>
            <input
              type="text"
              placeholder="Project Title"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />

            <input
              type="text"
              placeholder="Main Language"
              value={formData.language}
              onChange={e => setFormData({...formData, language: e.target.value})}
            />
          </div>

          <textarea
            rows="4"
            placeholder="Description"
            value={formData.desc}
            onChange={e => setFormData({...formData, desc: e.target.value})}
            required
          />

          <input
            type="text"
            placeholder="GitHub / Live Link"
            value={formData.link}
            onChange={e => setFormData({...formData, link: e.target.value})}
          />

          <input
            type="text"
            placeholder="Tech Stack (comma separated)"
            value={formData.tech}
            onChange={e => setFormData({...formData, tech: e.target.value})}
          />

          <div className={styles.uploadSection}>
            <label className={styles.fileLabel}>
              <FiUploadCloud />
              {image ? " Change Image" : " Upload Project Image"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className={styles.imagePreview}
              />
            )}
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? "Saving..." : "Save Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;