import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PatientForm from "../components/PatientForm";
import UploadScan from "../components/UploadScan";
import styles from "./Dashboard.module.css";

function Dashboard() {
  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Animated Header */}
        <h2 className={styles.title}>Brain Tumor Detection</h2>
        <h2 className={`${styles.title} ${styles.fadeIn}`}>
          and Classification
        </h2>

        <div className={styles.grid}>
          {/* Patient Info Card */}
          <div className={styles.card}>
            <PatientForm />
          </div>

          {/* Upload Scan Card */}
          <div className={styles.card}>
            <UploadScan />
          </div>

          {/* Quick Instructions Card */}
          <div className={styles.card}>
            <h3>Quick Instructions</h3>
            <ul className={styles.instructions}>
              <li>Fill patient name and age first.</li>
              <li>Upload MRI scan (JPG/PNG).</li>
              <li>System will analyze automatically.</li>
              <li>Download structured PDF report.</li>
              <li>Consult doctor for final diagnosis.</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
