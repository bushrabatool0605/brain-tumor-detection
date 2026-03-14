import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PatientForm from "../components/PatientForm";
import UploadScan from "../components/UploadScan";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [patient, setPatient] = useState(null);

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <h2 className={styles.title}>Brain Tumor Detection</h2>
        <h2 className={`${styles.title} ${styles.fadeIn}`}>
          and Classification
        </h2>

        <div className={styles.grid}>
          <div className={styles.card}>
            <PatientForm onSave={setPatient} />
          </div>
          <div className={styles.card}>
            <UploadScan patient={patient} />
          </div>
          <div className={styles.card}>
            <h3>Quick Instructions</h3>
            <ul className={styles.instructions}>
              <li>Enter patient info first.</li>
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
