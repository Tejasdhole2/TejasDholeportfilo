import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import StatsGrid from "./StatsGrid";
import ProjectTable from "./ProjectTable";
import MessageInbox from "./MessageInbox";
import ProjectForm from "./ProjectForm";
import ProfileManager from "./ProfileManager"; // ✅ Imported
import styles from "./Admin.module.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({
    projects: [],
    messages: [],
    views: 0
  });

  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const token = localStorage.getItem("adminToken");

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  /* ---------------- FETCH DASHBOARD DATA ---------------- */
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/overview",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setData(res.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  /* ---------------- OPEN PROJECT FORM ---------------- */
  const handleOpenForm = (project = null) => {
    setEditProject(project);
    setShowForm(true);
  };

  return (
    <div className={styles.adminLayout}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className={styles.viewport}>
        {/* Dashboard Overview */}
        {activeTab === "overview" && (
          <StatsGrid
            views={data.views}
            projCount={data.projects.length}
            msgCount={data.messages.length}
          />
        )}

        {/* Project Management */}
        {activeTab === "projects" && (
          <ProjectTable
            projects={data.projects}
            onEdit={handleOpenForm}
            onAdd={() => handleOpenForm()}
            onRefresh={fetchDashboardData}
          />
        )}

        {/* ✅ NEW: Profile & Resume Management */}
        {activeTab === "profile" && (
          <ProfileManager token={token} />
        )}

        {/* Messages */}
        {activeTab === "messages" && (
          <MessageInbox messages={data.messages} />
        )}
      </main>

      {/* Project Modal */}
      {showForm && (
        <ProjectForm
          existingProject={editProject}
          onClose={() => setShowForm(false)}
          onRefresh={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default AdminDashboard;