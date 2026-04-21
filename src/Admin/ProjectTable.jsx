import React from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import styles from './Admin.module.css';
import API from './utils/api';

const ProjectTable = ({ projects, onEdit, onAdd, onRefresh }) => {

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project permanently?")) {
      try {
        await API.delete(`/projects/${id}`);
        onRefresh();
      } catch (error) {
        console.error(error);
        alert("Delete failed");
      }
    }
  };

  return (
    <div className={styles.tableSection}>
      <div className={styles.tableHeaderInline}>
        <div className={styles.headerLeft}>
          <h2>Projects ({projects?.length || 0})</h2>
          <div className={styles.searchBox}>
            <FiSearch />
            <input type="text" placeholder="Search projects..." />
          </div>
        </div>

        <button onClick={onAdd} className={styles.addBtn}>
          <FiPlus /> New Project
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>Project Info</th>
              <th>Tech Stack</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects && projects.length > 0 ? (
              projects.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className={styles.projectCell}>
                      <img
                        src={p.image || "https://via.placeholder.com/50"}
                        alt=""
                      />
                      <div>
                        <strong>{p.title}</strong>
                        <span>{p.language}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={styles.techText}>
                      {p.tech?.join(" • ")}
                    </span>
                  </td>

                  <td className={styles.actionCell}>
                    <button onClick={() => onEdit(p)} className={styles.editBtn}>
                      <FiEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className={styles.deleteBtn}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "2rem" }}>
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;