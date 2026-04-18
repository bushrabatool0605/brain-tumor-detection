import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import styles from "./History.module.css";
import { FaDatabase, FaTrash, FaSearch, FaBrain, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHistory = () => {
    setLoading(true);
    fetch("http://localhost:8000/history")
      .then(res => res.json())
      .then(data => {
        setScans(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`http://localhost:8000/history/${deleteTarget}`, { method: "DELETE" });
      setScans(prev => prev.filter(s => s.scan_id !== deleteTarget));
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = scans.filter(s =>
    (s.patient_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalTumor = scans.filter(s => s.tumor === "Yes").length;
  const totalClear = scans.filter(s => s.tumor === "No").length;

  return (
    <DashboardLayout>
      <div className={styles.page}>

        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Patient Scan History</h2>
            <p className={styles.subtitle}>Review and manage past diagnosis records</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#eff6ff" }}>
              <FaBrain style={{ color: "#2563eb" }} />
            </div>
            <div>
              <p className={styles.statLabel}>Total Scans</p>
              <h3 className={styles.statValue}>{scans.length}</h3>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#fef2f2" }}>
              <FaTimesCircle style={{ color: "#dc2626" }} />
            </div>
            <div>
              <p className={styles.statLabel}>Tumor Detected</p>
              <h3 className={styles.statValue}>{totalTumor}</h3>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#f0fdf4" }}>
              <FaCheckCircle style={{ color: "#16a34a" }} />
            </div>
            <div>
              <p className={styles.statLabel}>No Tumor</p>
              <h3 className={styles.statValue}>{totalClear}</h3>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className={styles.searchWrap}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Table Card */}
        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.tableLoader} />
              <p>Loading records...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <FaDatabase className={styles.emptyIcon} />
              <h3>No Records Found</h3>
              <p>{search ? "No patient matches your search." : "Upload an MRI scan to see results here."}</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Status</th>
                    <th>Tumor Type</th>
                    <th>Confidence</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((scan, idx) => (
                    <tr key={scan.scan_id} className={styles.tableRow}
                      style={{ animationDelay: `${idx * 0.05}s` }}>
                      <td className={styles.idCell}>{idx + 1}</td>
                      <td>
                        <div className={styles.patientInfo}>
                          <span className={styles.avatar}>
                            {(scan.patient_name || "U").charAt(0).toUpperCase()}
                          </span>
                          <strong>{scan.patient_name || "Unknown"}</strong>
                        </div>
                      </td>
                      <td>
                        <span className={scan.tumor === "Yes" ? styles.badgeDanger : styles.badgeSuccess}>
                          {scan.tumor === "Yes" ? "Detected" : "Clear"}
                        </span>
                      </td>
                      <td className={styles.typeCell}>{scan.tumor_type || "—"}</td>
                      <td>
                        <div className={styles.progressWrapper}>
                          <div
                            className={styles.progressBar}
                            style={{ width: `${(scan.detection_confidence || 0) * 100}%` }}
                          />
                          <span className={styles.progressLabel}>
                            {((scan.detection_confidence || 0) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className={styles.dateCell}>{scan.date}</td>
                      <td>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => setDeleteTarget(scan.scan_id)}
                          title="Delete record"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalIcon}>
                <FaTrash />
              </div>
              <h3>Delete Record</h3>
              <p>Are you sure you want to permanently delete this scan record? This action cannot be undone.</p>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setDeleteTarget(null)} disabled={deleting}>
                  Cancel
                </button>
                <button className={styles.confirmBtn} onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default History;