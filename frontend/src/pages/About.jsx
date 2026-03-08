import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import styles from "./About.module.css";

const About = () => {
  return (
    <DashboardLayout>
      <div className={styles.container}>
        <h2>About the Project</h2>

        <section>
          <h3>Project Overview</h3>
          <p>
            The Brain Tumor Detection System is an AI-powered web application 
            designed to assist in the classification of brain MRI images. 
            The system analyzes uploaded MRI scans and predicts tumor categories 
            using a trained deep learning model.
          </p>
        </section>

        <section>
          <h3>Model Architecture</h3>
          <p>
            The prediction engine is based on a Convolutional Neural Network (CNN), 
            a deep learning architecture widely used for medical image analysis. 
            The model is trained to extract spatial features from MRI scans and 
            classify them into predefined tumor categories.
          </p>
        </section>

        <section>
          <h3>Technologies Used</h3>
          <ul>
            <li>Frontend: ReactJS (Vite)</li>
            <li>Backend: FastAPI</li>
            <li>Database: MySQL</li>
            <li>Deep Learning: TensorFlow / Keras</li>
          </ul>
        </section>

        <section>
          <h3>Purpose and Scope</h3>
          <p>
            This system is developed for research and educational purposes to 
            demonstrate the application of artificial intelligence in medical imaging.
          </p>
        </section>

        <section>
          <h3>System Limitations</h3>
          <p>
            The model predictions are dependent on image quality and dataset 
            training distribution. The system does not guarantee 100% accuracy 
            and should not be used as a substitute for professional medical diagnosis.
          </p>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default About;