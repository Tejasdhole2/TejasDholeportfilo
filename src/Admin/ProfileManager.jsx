import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUpload, FiSave, FiFileText, FiCheckCircle } from 'react-icons/fi';
import styles from './Admin.module.css';

const ProfileManager = ({ token }) => {
  const [profile, setProfile] = useState({ description: '', resumeFile: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/about').then(res => setProfile(res.data));
  }, []);

  const handleSaveText = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/about', { description: profile.description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Bio text updated!");
    } catch (err) {
      alert("Error updating bio.");
    } finally { setLoading(false); }
  };

  const handleUploadResume = async () => {
    if (!selectedFile) return alert("Please select a PDF file first.");
    setUploading(true);
    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const res = await axios.post("http://localhost:5000/api/about/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(prev => ({ ...prev, resumeFile: res.data.resumeFile }));
      alert("Resume PDF uploaded successfully!");
    } catch (err) {
      alert("Upload failed. Ensure the server is running and the file is a PDF.");
    } finally { setUploading(false); }
  };

  return (
    <div className={styles.managerContainer}>
      <h2 className={styles.adminTitle}>Profile Management</h2>
      
      {/* DESCRIPTION EDITOR */}
      <form onSubmit={handleSaveText} className={styles.profileForm}>
        <div className={styles.inputGroup}>
          <label><FiFileText /> Edit About Me Text</label>
          <textarea 
            rows="6"
            value={profile.description}
            onChange={(e) => setProfile({...profile, description: e.target.value})}
            placeholder="Describe your skills and experience..."
          />
        </div>
        <button type="submit" className={styles.saveBtn} disabled={loading}>
          <FiSave /> {loading ? "Saving..." : "Update Bio Text"}
        </button>
      </form>

      <div className={styles.divider} />

      {/* DIRECT PDF UPLOAD */}
      <div className={styles.uploadSection}>
        <h3><FiUpload /> Upload New Resume (PDF Only)</h3>
        <div className={styles.uploadBox}>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={(e) => setSelectedFile(e.target.files[0])} 
            className={styles.fileInput}
          />
          <button onClick={handleUploadResume} disabled={uploading} className={styles.uploadBtn}>
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </div>
        
        {profile.resumeFile && (
          <div className={styles.successBadge}>
            <FiCheckCircle /> <span>A Resume is currently active on your site.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileManager;