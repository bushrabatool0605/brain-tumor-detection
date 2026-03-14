import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import styles from "./History.module.css";

function History() {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/history")
      .then(res => res.json())
      .then(data => setScans(data))
      .catch(err => console.error("Error fetching history:", err));
  }, []);

  return (
    <DashboardLayout>
      <h2>Patient Scan History</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Tumor</th>
            <th>Tumor Type</th>
            <th>Detection Confidence</th>
            <th>Classification Confidence</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan, idx) => (
            <tr key={idx}>
              <td>{scan.image_name}</td>
              <td>{scan.tumor}</td>
              <td>{scan.tumor_type || "-"}</td>
              <td>{scan.detection_confidence ? (scan.detection_confidence * 100).toFixed(2) + "%" : "-"}</td>
              <td>{scan.classification_confidence ? (scan.classification_confidence * 100).toFixed(2) + "%" : "-"}</td>
              <td>{scan.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}

export default History;
