import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

// Portfolio Components
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Contact from "./components/Contact/Contact";
import AllProjects from "./components/Projects/AllProjects";

// Admin Pages
import AdminDashboard from "./Admin/AdminDashboard";
import AdminLogin from "./Admin/AdminLogin";

/* ---------------- SCROLL TO TOP ---------------- */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/* ---------------- FOOTER ---------------- */
const Footer = () => (
  <footer
    style={{
      textAlign: "center",
      padding: "40px",
      color: "var(--text-dim)",
      borderTop: "1px solid var(--glass-border)",
      marginTop: "50px",
      position: "relative",
      zIndex: 10
    }}
  >
    © {new Date().getFullYear()} Tejas Dhole. All rights reserved.
  </footer>
);

/* ---------------- MAIN LANDING PAGE ---------------- */
const MainLayout = () => (
  <>
    <Navbar />
    <Hero />
    <About />
    <Projects />
    <Contact />
    <Footer />
  </>
);

/* ---------------- APP ---------------- */
function App() {
  return (
    <Router>
      <ScrollToTop />

      <div className="App">
        {/* Background Blobs */}
        <div className="bg-glow">
          <div className="blob" style={{ top: "10%", left: "10%" }}></div>
          <div
            className="blob"
            style={{
              bottom: "10%",
              right: "10%",
              background: "#6366f1"
            }}
          ></div>
        </div>

        <Routes>
          {/* Portfolio Routes */}
          <Route path="/" element={<MainLayout />} />

          <Route
            path="/projects"
            element={
              <>
                <Navbar />
                <div style={{ paddingTop: "80px" }}>
                  <AllProjects />
                </div>
                <Footer />
              </>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;