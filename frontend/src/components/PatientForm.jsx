import React, { useState } from "react";
import styles from "./PatientForm.module.css";

function PatientForm({ onSave }) {
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
  };

  return (
    <div className={styles.card}>
      <h3>Patient Information</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Patient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button type="submit">Save Patient</button>
      </form>
    </div>
  );
}

export default PatientForm;
