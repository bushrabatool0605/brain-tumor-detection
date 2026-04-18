import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import styles from "./UserManual.module.css";
import {
  FaUserCheck, FaUpload, FaBrain,
  FaFilePdf, FaUserMd, FaExclamationCircle
} from "react-icons/fa";

const steps = [
  {
    icon: <FaUserCheck />,
    step: "Step 01",
    title: "Enter Patient Information",
    desc: "Fill in the patient's full name, age, and gender accurately before proceeding. This information will appear in the generated report.",
  },
  {
    icon: <FaUpload />,
    step: "Step 02",
    title: "Upload MRI Scan",
    desc: "Click the upload area to select a brain MRI image. Supported formats: JPG, JPEG, PNG. Ensure the image is clear, unobstructed, and minimum 224×224 pixels.",
  },
  {
    icon: <FaBrain />,
    step: "Step 03",
    title: "Run AI Analysis",
    desc: "Click Analyze MRI to run the detection model. The system will determine whether a tumor is present and provide a confidence score.",
  },
  {
    icon: <FaBrain />,
    step: "Step 04",
    title: "Classify Tumor Type",
    desc: "If a tumor is detected, click Predict Tumor Type to classify it as Glioma, Meningioma, or Pituitary. A second confidence score is provided.",
  },
  {
    icon: <FaFilePdf />,
    step: "Step 05",
    title: "Download Report",
    desc: "Click View Full Report to preview the structured diagnosis report, then download it as a PDF for record-keeping or clinical reference.",
  },
  {
    icon: <FaUserMd />,
    step: "Step 06",
    title: "Consult a Physician",
    desc: "Always share the report with a certified radiologist or medical professional for final clinical interpretation and diagnosis.",
  },
];

const requirements = [
  "Upload only axial-view brain MRI scans for optimal accuracy.",
  "Avoid blurred, cropped, distorted, or partially visible images.",
  "Do not upload non-medical, annotated, or heavily watermarked images.",
  "Ensure the image resolution is at least 224 × 224 pixels.",
  "Avoid images containing heavy noise or scan artifacts.",
  "Only JPG, JPEG, and PNG formats are supported.",
];

const UserManual = () => {
  return (
    <DashboardLayout>
      <div className={styles.page}>

        {/* Header */}
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>User Manual</h2>
          <p className={styles.pageSubtitle}>Step-by-step guide for using the NeuroScan AI system</p>
        </div>

        {/* Steps */}
        <div className={styles.stepsGrid}>
          {steps.map((s, idx) => (
            <div
              key={idx}
              className={styles.stepCard}
              style={{ animationDelay: `${idx * 0.07}s` }}
            >
              <div className={styles.stepHeader}>
                <span className={styles.stepLabel}>{s.step}</span>
                <div className={styles.stepIcon}>{s.icon}</div>
              </div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Image Requirements */}
        <div className={styles.reqCard}>
          <div className={styles.reqHeader}>
            <FaExclamationCircle className={styles.reqIcon} />
            <h3 className={styles.reqTitle}>Image Quality Requirements</h3>
          </div>
          <div className={styles.reqGrid}>
            {requirements.map((req, idx) => (
              <div key={idx} className={styles.reqItem}>
                <span className={styles.reqDot} />
                <span>{req}</span>
              </div>
            ))}
          </div>
          <div className={styles.reqNote}>
            ⚠ Incorrect or low-quality images may result in inaccurate predictions. Always verify image quality before uploading.
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UserManual;