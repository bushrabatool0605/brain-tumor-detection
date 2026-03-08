import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import styles from "./UserManual.module.css";

const UserManual = () => {
  return (
    <DashboardLayout>
      <div className={styles.container}>
        <h2>📋 Instructions for Using the System</h2>

        <ul>
          <li>Upload only clear MRI brain images for accurate analysis.</li>
          <li>The image should not be blurred, cropped, distorted, or partially visible.</li>
          <li>Ensure that the brain region is clearly visible in the image.</li>
          <li>Supported file formats: JPG, JPEG, PNG.</li>
          <li>Do not upload non-medical or unrelated images.</li>
          <li>Ensure the image resolution is adequate (minimum 224 × 224 pixels recommended).</li>
          <li>Avoid images containing heavy noise, annotations, or markings.</li>
        </ul>

        <p className={styles.note}>
          ⚠ Incorrect or low-quality images may result in inaccurate predictions.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default UserManual;