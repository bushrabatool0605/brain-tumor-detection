import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import styles from "./ChangePassword.module.css";
import { FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
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
        setSuccess(true);
        setEmail("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError("Invalid credentials. Please check your email and old password.");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.card}>

          {/* Header */}
          <div className={styles.cardHeader}>
            <div className={styles.iconWrap}>
              <FaLock />
            </div>
            <div>
              <h2 className={styles.title}>Change Password</h2>
              <p className={styles.subtitle}>Update your account credentials securely</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Success Banner */}
          {success && (
            <div className={styles.successBanner}>
              <FaCheckCircle />
              <span>Password updated successfully.</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className={styles.errorBanner}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrap}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Current Password</label>
              <div className={styles.inputWrap}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>New Password</label>
                <div className={styles.inputWrap}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirm Password</label>
                <div className={styles.inputWrap}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : "Update Password"}
            </button>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;