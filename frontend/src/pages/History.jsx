import React, { useState, useEffect } from "react";
import styles from "./History.module.css";
import DashboardLayout from "../components/layout/DashboardLayout";

function History() {
  const [history, setHistory] = useState([]);

  // ✅ Fetch history from backend
  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:8000/history");
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
      }
    } catch (err) {
      console.log("History fetch error:", err);
    }
  };

  // ✅ Load history on page open
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <h2>Scan History</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Date</th>
              <th>Result</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(history) && history.length > 0 ? (
              history.map((scan, index) => (
                <tr key={index}>
                  <td>{scan.image_name}</td>
                  <td>{new Date(scan.date).toLocaleString()}</td>
                  <td className={styles.yes}>{scan.tumor}</td>
                  <td>{scan.tumor_type || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.placeholder}>
                  No history available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default History;
