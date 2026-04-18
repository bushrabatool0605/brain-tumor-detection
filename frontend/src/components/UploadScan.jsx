import React, { useState } from "react";
import styles from "./UploadScan.module.css";
import jsPDF from "jspdf";
import {
  FaTimes, FaDownload, FaFileMedical,
  FaCloudUploadAlt, FaBrain, FaRedo, FaMapMarkerAlt
} from "react-icons/fa";

function UploadScan({ patient }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile]         = useState(null);
  const [tumorDetected, setTumorDetected] = useState(null);
  const [tumorType, setTumorType]         = useState("");
  const [heatmap, setHeatmap]             = useState(null);
  const [confidence1, setConfidence1]     = useState(null);
  const [confidence2, setConfidence2]     = useState(null);
  const [scanId, setScanId]               = useState(null);
  const [loading, setLoading]             = useState(false);
  const [showPreview, setShowPreview]     = useState(false);

  // ── Reset ──────────────────────────────────────────────
  const handleReset = () => {
    setSelectedImage(null); setImageFile(null);
    setTumorDetected(null); setTumorType("");
    setHeatmap(null);       setScanId(null);
    setConfidence1(null);   setConfidence2(null);
  };

  // ── Upload ─────────────────────────────────────────────
  const handleImageUpload = (e) => {
    if (!patient?.name || !patient?.age) {
      alert("Please save patient information first.");
      return;
    }
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setTumorDetected(null); setHeatmap(null);
      setTumorType(""); setConfidence1(null); setConfidence2(null);
    }
  };

  // ── Drag & Drop ────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault();
    if (!patient?.name || !patient?.age) {
      alert("Please save patient information first.");
      return;
    }
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setTumorDetected(null); setHeatmap(null);
      setTumorType(""); setConfidence1(null); setConfidence2(null);
    }
  };

  // ── Analyze ────────────────────────────────────────────
  const analyzeMRI = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("patient_name", patient.name);
    formData.append("patient_age", patient.age);
    formData.append("patient_gender", patient.gender || "");

    try {
      setLoading(true);
      const res  = await fetch("http://localhost:8000/predict", { method: "POST", body: formData });
      const data = await res.json();
      setTumorDetected(data.tumor);
      setConfidence1(data.confidence1);
      setScanId(data.scan_id);
    } catch {
      alert("Server error during analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Classify + Heatmap ─────────────────────────────────
  const classifyTumor = async () => {
    if (!scanId || !imageFile) return;
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("scan_id", scanId);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/classify", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Classification failed.");
      const data = await res.json();
      setTumorType(data.tumor_type);
      setConfidence2(data.confidence2);
      setHeatmap(data.heatmap);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── PDF Download ───────────────────────────────────────
  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Brain Tumor Detection Report", 20, 22);

    // Patient Info
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Patient Name : ${patient?.name || "N/A"}`, 20, 50);
    doc.text(`Age          : ${patient?.age || "N/A"}`, 20, 60);
    doc.text(`Gender       : ${patient?.gender || "N/A"}`, 20, 70);
    doc.text(`Scan Date    : ${new Date().toLocaleString()}`, 20, 80);

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 88, 190, 88);

    // Results
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Diagnosis Results", 20, 98);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Tumor Detected : ${tumorDetected}`, 20, 110);
    if (confidence1 !== null)
      doc.text(`Detection Confidence : ${(confidence1 * 100).toFixed(2)}%`, 20, 120);
    if (tumorType) {
      doc.text(`Tumor Type : ${tumorType}`, 20, 130);
      if (confidence2 !== null)
        doc.text(`Classification Confidence : ${(confidence2 * 100).toFixed(2)}%`, 20, 140);
    }

    // Heatmap
    if (heatmap) {
      doc.text("Tumor Location (Grad-CAM Heatmap):", 20, 158);
      doc.addImage(`data:image/jpeg;base64,${heatmap}`, "JPEG", 20, 164, 80, 80);
    }

    // Disclaimer
    const disclaimerY = heatmap ? 258 : 160;
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(
      "Disclaimer: This report is AI-generated and intended for informational purposes only.\nConsult a qualified medical professional for clinical diagnosis.",
      20, disclaimerY, { maxWidth: 170 }
    );

    doc.save(`Report_${patient?.name || "Patient"}.pdf`);
    setShowPreview(false);
  };

  return (
    <div className={styles.container}>

      {/* ── UPLOAD STATE ── */}
      {tumorDetected === null ? (
        <div className={styles.uploadCard}>
          <h3 className={styles.cardTitle}>Upload MRI Scan</h3>

          <label
            className={styles.uploadArea}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            <FaCloudUploadAlt className={styles.uploadIcon} />
            <span className={styles.uploadText}>
              {selectedImage ? "Click to change image" : "Click or drag & drop to upload"}
            </span>
            <p className={styles.uploadSub}>Supported: JPG, PNG · Min. 224×224px</p>
          </label>

          {selectedImage && (
            <div className={styles.imageWrapper}>
              <img src={selectedImage} alt="MRI Preview" className={styles.preview} />
            </div>
          )}

          <button
            onClick={analyzeMRI}
            disabled={!selectedImage || loading}
            className={styles.analyzeBtn}
          >
            {loading
              ? <><span className={styles.spinner} /> Analyzing...</>
              : <><FaBrain /> Analyze MRI</>
            }
          </button>
        </div>

      ) : (

        /* ── RESULT STATE ── */
        <div className={`${styles.reportCard} ${styles.fadeIn}`}>

          {/* Report Header */}
          <div className={styles.reportHeader}>
            <h3 className={styles.cardTitle}>Diagnosis Report</h3>
            <button onClick={handleReset} className={styles.newScanBtn}>
              <FaRedo /> New Scan
            </button>
          </div>

          {/* Status Row */}
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Tumor Status</span>
            <span className={tumorDetected === "Yes" ? styles.badgeDanger : styles.badgeSuccess}>
              {tumorDetected === "Yes" ? "Detected" : "Not Detected"}
            </span>
          </div>

          {/* Confidence Bar */}
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Confidence</span>
            <div className={styles.barWrap}>
              <div
                className={styles.barFill}
                style={{ width: `${(confidence1 * 100).toFixed(0)}%` }}
              />
              <span className={styles.barLabel}>{(confidence1 * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Classify Section */}
          {tumorDetected === "Yes" && (
            <div className={styles.classifySection}>
              {!tumorType ? (
                <button
                  onClick={classifyTumor}
                  disabled={loading}
                  className={styles.locateBtn}
                >
                  {loading
                    ? <><span className={styles.spinnerDark} /> Locating Tumor...</>
                    : <><FaMapMarkerAlt /> Classify & Locate Tumor</>
                  }
                </button>
              ) : (
                <div className={`${styles.typeResult} ${styles.fadeIn}`}>

                  {/* Type Row */}
                  <div className={styles.resultRow}>
                    <span className={styles.resultLabel}>Tumor Type</span>
                    <span className={styles.typeChip}>{tumorType}</span>
                  </div>

                  {/* Confidence 2 */}
                  <div className={styles.resultRow}>
                    <span className={styles.resultLabel}>Type Confidence</span>
                    <div className={styles.barWrap}>
                      <div
                        className={`${styles.barFill} ${styles.barBlue}`}
                        style={{ width: `${(confidence2 * 100).toFixed(0)}%` }}
                      />
                      <span className={styles.barLabel}>{(confidence2 * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Heatmap */}
                  {heatmap && (
                    <div className={styles.heatmapBox}>
                      <p className={styles.heatmapLabel}>
                        <FaMapMarkerAlt /> Tumor Location — Grad-CAM Visualization
                      </p>
                      <img
                        src={`data:image/jpeg;base64,${heatmap}`}
                        alt="Grad-CAM Heatmap"
                        className={styles.heatmapImg}
                      />
                      <p className={styles.heatmapNote}>
                        Highlighted region indicates the area of interest identified by the AI model.
                      </p>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {/* View Report */}
          <button
            onClick={() => setShowPreview(true)}
            className={styles.viewReportBtn}
          >
            <FaFileMedical /> View Full Report
          </button>

        </div>
      )}

      {/* ── PDF PREVIEW MODAL ── */}
      {showPreview && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={() => setShowPreview(false)}>
              <FaTimes />
            </button>

            <h2 className={styles.modalTitle}>Report Preview</h2>
            <p className={styles.modalSub}>Brain Tumor Detection Report</p>

            <div className={styles.previewBody}>
              <div className={styles.previewSection}>
                <p className={styles.sectionLabel}>Patient Information</p>
                <div className={styles.prevRow}>
                  <span>Name</span><strong>{patient?.name}</strong>
                </div>
                <div className={styles.prevRow}>
                  <span>Age</span><strong>{patient?.age}</strong>
                </div>
                <div className={styles.prevRow}>
                  <span>Gender</span><strong>{patient?.gender || "N/A"}</strong>
                </div>
                <div className={styles.prevRow}>
                  <span>Date</span><strong>{new Date().toLocaleDateString()}</strong>
                </div>
              </div>

              <div className={styles.previewSection}>
                <p className={styles.sectionLabel}>Diagnosis</p>
                <div className={styles.prevRow}>
                  <span>Tumor Detected</span>
                  <span className={tumorDetected === "Yes" ? styles.badgeDanger : styles.badgeSuccess}>
                    {tumorDetected === "Yes" ? "Detected" : "Not Detected"}
                  </span>
                </div>
                {confidence1 !== null && (
                  <div className={styles.prevRow}>
                    <span>Confidence</span>
                    <strong>{(confidence1 * 100).toFixed(2)}%</strong>
                  </div>
                )}
                {tumorType && (
                  <div className={styles.prevRow}>
                    <span>Tumor Type</span>
                    <strong>{tumorType}</strong>
                  </div>
                )}
              </div>

              {heatmap && (
                <div className={styles.previewSection}>
                  <p className={styles.sectionLabel}>Grad-CAM Visualization</p>
                  <img
                    src={`data:image/jpeg;base64,${heatmap}`}
                    alt="Heatmap"
                    className={styles.modalHeatmap}
                  />
                </div>
              )}

              <p className={styles.modalDisclaimer}>
                This report is AI-generated. Always consult a qualified radiologist or physician for clinical interpretation.
              </p>
            </div>

            <button onClick={handleDownloadPdf} className={styles.downloadBtn}>
              <FaDownload /> Download PDF Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default UploadScan;