import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./DashboardLayout.module.css";

import {
  FaHome,
  FaSignInAlt,
  FaKey,
  FaFileAlt,
  FaBook,
  FaInfoCircle,
  FaBars
} from "react-icons/fa";

const DashboardLayout = ({ children, loading }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
        <div className={styles.topSection}>
          <button
            className={styles.menuBtn}
            onClick={() => setCollapsed(!collapsed)}
          >
            <FaBars />
          </button>
          {!collapsed && <h2>Medical AI</h2>}
        </div>

        <nav className={styles.nav}>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? styles.active : "")}>
            <FaHome /> {!collapsed && <span>Dashboard</span>}
          </NavLink>
          <NavLink to="/usermanual" className={({ isActive }) => (isActive ? styles.active : "")}>
            <FaBook /> {!collapsed && <span>User Manual</span>}
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? styles.active : "")}>
            <FaInfoCircle /> {!collapsed && <span>About</span>}
          </NavLink>
          <NavLink to="/disclaimer" className={({ isActive }) => (isActive ? styles.active : "")}>
            <FaFileAlt /> {!collapsed && <span>Disclaimer</span>}
          </NavLink>
          <NavLink to="/change-password" className={({ isActive }) => (isActive ? styles.active : "")}>
            <FaKey /> {!collapsed && <span>Change Password</span>}
          </NavLink>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : "")}>
            <FaSignInAlt /> {!collapsed && <span>Login</span>}
          </NavLink>
        </nav>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {children}
      </div>

      {/* ✅ Overlay Loader */}
      {loading && (
        <div className={styles.overlay}>
          <div className={styles.loader}>Loading...</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
