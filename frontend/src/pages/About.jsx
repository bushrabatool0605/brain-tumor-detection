import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import styles from "./About.module.css";
import { FaBrain, FaMicrochip, FaLayerGroup, FaExclamationTriangle, FaBullseye } from "react-icons/fa";

const sections = [
  {
    icon: <FaBullseye />,
    title: "Project Overview",
    content:
      "NeuroScan AI is an AI-powered diagnostic assistance system designed to support radiologists and clinicians in the classification of brain MRI images. The system analyzes uploaded MRI scans and predicts tumor categories using a trained deep learning model, providing confidence scores for each prediction.",
  },
  {
    icon: <FaBrain />,
    title: "Model Architecture",
    content:
      "The prediction engine is built on a Convolutional Neural Network (CNN) architecture — a deep learning model widely validated for medical image analysis. The model extracts spatial features from MRI scans and classifies them into four predefined categories: Glioma, Meningioma, Pituitary Tumor, and No Tumor.",
  },
  {
    icon: <FaMicrochip />,
    title: "Technologies Used",
    items: [
      "Frontend: React.js (Vite) with CSS Modules",
      "Backend: FastAPI (Python)",
      "Database: SQLite",
      "Deep Learning: TensorFlow / Keras",
      "Report Generation: jsPDF",
    ],
  },
  {
    icon: <FaLayerGroup />,
    title: "Purpose & Scope",
    content:
      "This system is developed for research and educational purposes to demonstrate the application of artificial intelligence in medical imaging. It is intended as a decision-support tool for trained medical professionals and not as a standalone diagnostic device.",
  },
  {
    icon: <FaExclamationTriangle />,
    title: "System Limitations",
    content:
      "Model predictions are dependent on image quality and training data distribution. The system does not guarantee 100% accuracy and must not be used as a substitute for professional medical diagnosis or clinical judgment.",
    warning: true,
  },
];

const About = () => {
  return (
    <DashboardLayout>
      <div className={styles.page}>

        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>About the Project</h2>
          <p className={styles.pageSubtitle}>
            Technical overview of NeuroScan AI — Brain Tumor Detection & Classification System
          </p>
        </div>

        {/* Cards Grid */}
        <div className={styles.grid}>
          {sections.map((sec, idx) => (
            <div
              key={idx}
              className={`${styles.card} ${sec.warning ? styles.warningCard : ""}`}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className={`${styles.cardIcon} ${sec.warning ? styles.warnIcon : ""}`}>
                {sec.icon}
              </div>
              <h3 className={`${styles.cardTitle} ${sec.warning ? styles.warnTitle : ""}`}>
                {sec.title}
              </h3>
              {sec.content && (
                <p className={styles.cardText}>{sec.content}</p>
              )}
              {sec.items && (
                <ul className={styles.itemList}>
                  {sec.items.map((item, i) => (
                    <li key={i} className={styles.itemRow}>
                      <span className={styles.dot} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default About;