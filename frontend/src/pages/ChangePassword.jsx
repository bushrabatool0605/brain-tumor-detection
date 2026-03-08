import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import styles from "./ChangePassword.module.css";

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        alert("Password updated successfully");
        setEmail("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Change password error:", err);
      alert("Server error");
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.card}>
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Old Password:</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />

          <label>New Password:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <button type="submit">Update</button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;
