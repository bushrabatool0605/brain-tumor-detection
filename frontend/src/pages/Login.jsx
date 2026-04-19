import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { FaEnvelope, FaLock, FaBrain } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Logo / Brand */}
        <div className={styles.brand}>
          <div className={styles.iconWrap}>
            <FaBrain className={styles.brandIcon} />
          </div>
          <h1 className={styles.brandName}>NeuroScan AI</h1>
          <p className={styles.brandSub}>Brain Tumor Detection System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.inputIcon} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.inputIcon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : "Sign In"}
          </button>

        </form>

        <p className={styles.disclaimer}>
          For authorized medical personnel only
        </p>
      </div>
    </div>
  );
};

export default Login;