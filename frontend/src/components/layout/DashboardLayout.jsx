import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./DashboardLayout.module.css";
import {
  FaHome, FaSignOutAlt, FaKey, FaFileAlt,
  FaBook, FaInfoCircle, FaBars, FaHistory, FaBrain
} from "react-icons/fa";

const DashboardLayout = ({ children, loading }) => {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarState");
    return saved === "open" ? false : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarState", collapsed ? "closed" : "open");
  }, [collapsed]);

  const handleMenuToggle = () => setCollapsed(!collapsed);

  const handleLinkClick = (e) => {
    if (collapsed) {
      e.preventDefault();
      setCollapsed(false);
    }
  };

  return (
    <div className={styles.layout}>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
        <div className={styles.sidebarInner}>

          {/* Top: Brand + Toggle */}
          <div className={styles.topSection}>
            {!collapsed && (
              <div className={styles.brand}>
                <div className={styles.brandIcon}>
                  <FaBrain />
                </div>
                <div className={styles.brandText}>
                  <p className={styles.brandName}>NeuroScan AI</p>
                  <p className={styles.brandSub}>Detection System</p>
                </div>
              </div>
            )}
            <button className={styles.menuBtn} onClick={handleMenuToggle}>
              <FaBars />
            </button>
          </div>

          <div className={styles.divider} />

          {/* Main Navigation */}
          {!collapsed && <p className={styles.navLabel}>Main Menu</p>}
          <nav className={styles.nav}>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? styles.active : ""}
              onClick={handleLinkClick}
            >
              <FaHome />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) => isActive ? styles.active : ""}
              onClick={handleLinkClick}
            >
              <FaHistory />
              {!collapsed && <span>Scan History</span>}
            </NavLink>
          </nav>

          {/* Info Section */}
           {!collapsed && <p className={styles.navLabelInfo}>Information</p>}          <nav className={styles.nav} style={{ marginTop: collapsed ? "16px" : "0" }}>
            <NavLink
              to="/usermanual"
              className={({ isActive }) => isActive ? styles.active : ""}
              onClick={handleLinkClick}
            >
              <FaBook />
              {!collapsed && <span>User Manual</span>}
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => isActive ? styles.active : ""}
              onClick={handleLinkClick}
            >
              <FaInfoCircle />
              {!collapsed && <span>About</span>}
            </NavLink>

            <NavLink
              to="/disclaimer"
              className={({ isActive }) => isActive ? styles.active : ""}
              onClick={handleLinkClick}
            >
              <FaFileAlt />
              {!collapsed && <span>Disclaimer</span>}
            </NavLink>
          </nav>

          {/* Bottom: Account */}
          <div className={styles.navBottom}>
            <NavLink
              to="/change-password"
              className={({ isActive }) => isActive ? styles.active : ""}
              onClick={handleLinkClick}
            >
              <FaKey />
              {!collapsed && <span>Change Password</span>}
            </NavLink>

            <NavLink
              to="/"
              className={({ isActive }) => isActive ? styles.active : ""}
              onClick={handleLinkClick}
            >
              <FaSignOutAlt />
              {!collapsed && <span>Logout</span>}
            </NavLink>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {children}
      </div>

      {/* Global Loader */}
      {loading && (
        <div className={styles.overlayLoader}>
          <div className={styles.loader} />
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;