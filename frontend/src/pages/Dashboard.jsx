import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PatientForm from "../components/PatientForm";
import UploadScan from "../components/UploadScan";
import styles from "./Dashboard.module.css";
import { FaUserCheck, FaUpload, FaBrain, FaFilePdf, FaUserMd } from "react-icons/fa";

function Dashboard() {
  const [patient, setPatient] = useState(null);

  return (
    <DashboardLayout>
      <div className={styles.container}>
        
        <div className={styles.headerSection}>
          <h1 className={styles.mainTitle}>
            Brain Tumor Detection & Classification
          </h1>
          <p className={styles.subtitle}>
            AI-Powered Diagnostic Assistance System
          </p>
        </div>

        <div className={styles.grid}>
          
          {/* Column 1: Patient Form */}
          <div className={styles.gridColumn}>
            <PatientForm onSave={setPatient} />
          </div>

          {/* Column 2: Upload Scan */}
          <div className={styles.gridColumn}>
            <UploadScan patient={patient} />
          </div>

          {/* Column 3: Clean Instructions */}
          <div className={styles.gridColumn}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Quick Instructions</h3>
              
              {/* Simple List without numbers/headings */}
              <ul className={styles.simpleList}>
                <li><FaUserCheck className={styles.listIcon} /> Enter patient details accurately.</li>
                <li><FaUpload className={styles.listIcon} /> Upload clear MRI scan (JPG/PNG).</li>
                <li><FaBrain className={styles.listIcon} /> System analyzes automatically.</li>
                <li><FaFilePdf className={styles.listIcon} /> Download structured PDF report.</li>
                <li><FaUserMd className={styles.listIcon} /> Consult doctor for final diagnosis.</li>
              </ul>
              
            </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;