import React, { useState } from "react";
import styles from "./PatientForm.module.css";
import { FaChevronDown } from "react-icons/fa"; // Icon import

function PatientForm({ onSave }) {//onsav prop use kr rhy to snd data to parent
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !age) {
      alert("Please enter patient name and age");
      return;
    }
    onSave({ name, age, gender });

    // Fields clear karne ka logic
    setName("");
    setAge("");
    setGender("");
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Patient Information</h3>
      <form onSubmit={handleSubmit}>
        
        <div className={styles.formGroup}>
          <label>Patient Name</label>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Age</label>
            <input
              type="number"
              placeholder="e.g., 25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Gender</label>
            {/* Custom Select Wrapper for better UI */}
            <div className={styles.selectWrapper}>
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value)}
                className={styles.inputField}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <FaChevronDown className={styles.selectIcon} />
            </div>
          </div>
        </div>

        <button type="submit" className={styles.saveBtn}>
          Save Patient
        </button>
      </form>
    </div>
  );
}

export default PatientForm;