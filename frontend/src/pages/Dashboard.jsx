import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import DashboardLayout from "../components/layout/DashboardLayout";

function Dashboard() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [tumorDetected, setTumorDetected] = useState(null);
  const [tumorType, setTumorType] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [confidence, setConfidence] = useState(null);

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

  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setTumorDetected(null);
      setTumorType("");
    }
  };

  // Analyze MRI (Tumor Yes/No)
  const analyzeMRI = async () => {
    if (!imageFile) {
      alert("Please upload an MRI image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setTumorDetected(data.tumor); // "Yes" / "No"
      setTumorType("");
      setConfidence(data.confidence);  


      // ✅ Refresh history after prediction
      fetchHistory();
    } catch (error) {
      console.error("Prediction Error:", error);
    } finally {
      // ✅ Always reset loading
      setLoading(false);
    }
  };

  // Predict Tumor Type
  const predictType = async () => {
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/classify", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setTumorType(data.tumor_type);
      setConfidence(data.confidence);  

      // ✅ Refresh history after classification
      fetchHistory();
    } catch (error) {
      console.error("Classification Error:", error);
    } finally {
      // ✅ Always reset loading
      setLoading(false);
    }
  };

  return (
    <DashboardLayout loading={loading}>
      <div className={styles.container}>
        <h2 className={styles.title}>BRAIN TUMOR</h2>
        <h2 className={styles.title}>DETECTION AND CLASSIFICATION</h2>

        <div className={styles.grid}>
          {/* Upload Card */}
          <div className={styles.card}>
            <h3>Upload MRI Scan</h3>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {selectedImage && (
              <img
                src={selectedImage}
                alt="MRI Preview"
                className={styles.preview}
              />
            )}
            <button className={styles.btn} onClick={analyzeMRI}>
              {loading ? "Analyzing..." : "Analyze MRI"}
            </button>
          </div>

          {/* Prediction Result */}
          <div className={styles.card}>
            <h3>Prediction Result</h3>
            {tumorDetected === null && (
              <p className={styles.placeholder}>No prediction yet</p>
            )}
            {tumorDetected && (
              <>
                <p>
                  Tumor Detected :
                  <span className={styles.yes}>{tumorDetected}</span>
                </p>
                {confidence !== null && (
                <p className={styles.confidence}>
                 Confidence: {(confidence * 100).toFixed(2)}%
                </p>
    )}
                {tumorDetected === "Yes" && (
                  <button
                    className={styles.secondaryBtn}
                    onClick={predictType}
                  >
                    Predict Tumor Type
                  </button>
                )}
              </>
            )}
          </div>

          {/* Classification */}
          <div className={styles.card}>
            <h3>Tumor Classification</h3>
            {!tumorType && (
              <p className={styles.placeholder}>
                Classification not generated
              </p>
            )}
            {tumorType && <p className={styles.type}>{tumorType}</p> }
            {confidence !== null && (
             <p className={styles.confidence}>
             Confidence: {(confidence * 100).toFixed(2)}%
            </p>)}
          </div>

          {/* Instructions */}
          <div className={styles.card}>
            <h3>Quick Instructions</h3>
            <ul>
              <li>Upload clear MRI brain scan.</li>
              <li>Supported formats: JPG, PNG.</li>
              <li>Ensure brain region is visible.</li>
              <li>AI will analyze automatically.</li>
            </ul>
          </div>
        </div>

        {/* History */}
        <div className={styles.historyCard}>
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
                    <td>{scan.date}</td>
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
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
