import { useState, useEffect } from "react";

const API = "http://localhost:8000/api";

export function useScanHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/scan-history`); // get request to backend
      const data = await res.json();
      const mapped = data.map((r) => ({
        id:      r.id,
        savedAt: r.saved_at,
        image:   r.image_base64,
        gradcam: r.gradcam_base64 || null,   
        patient: {
          name:   r.patient_name,
          age:    r.patient_age,
          gender: r.patient_gender,
        },
        result: { // nested object
          label:      r.result_label,
          confidence: r.result_confidence,
          tumor:      r.tumor_detected,
          type:       r.result_label,
          severity:   r.result_severity,
          location:   r.result_location,
          notes:      r.result_notes,
        },
      }));
      setHistory(mapped);
    } catch (err) {
      console.error("History fetch error:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const saveScan = (patient, result, imageFile, gradcamUrl = null) => { // yeah resolve(formatted) return krta
    return new Promise((resolve) => {
      const saveRecord = async (base64Image) => {
        const record = {
          id:               Date.now().toString(), // for uniqueness milisecond sko string me  1970 se ab tak kitne milliseconds guzar chuke hain
          saved_at:         new Date().toISOString(), // date time ko stamdard format me covert
          patient_name:     patient?.name   || "Unknown",
          patient_age:      patient?.age    || "",
          patient_gender:   patient?.gender || "",
          result_label:     result?.type    || result?.label || "",
          result_confidence: result?.confidence || 0,
          result_severity:  result?.severity || "",
          result_location:  result?.location || "",
          result_notes:     result?.notes    || "",
          tumor_detected:   result?.tumor    || "No",
          image_base64:     base64Image,
          gradcam_base64:   gradcamUrl,       
        };

        try {
          const res   = await fetch(`${API}/scan-history`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(record),
          });
          await res.json();

          const formatted = {
            id:      record.id,
            savedAt: record.saved_at,
            image:   base64Image,
            gradcam: gradcamUrl,             
            patient,
            result,
          };
          setHistory((prev) => [formatted, ...prev]);
          resolve(formatted);
        } catch (err) {
          console.error("Save error:", err);
          resolve(null);
        }
      };

      if (!imageFile) {
        saveRecord(null);
      } else {
        const reader    = new FileReader(); // yeah just file read kre ga 
        reader.onload  = () => saveRecord(reader.result); // result "image ka base64 version" yeah mile ga 
        reader.onerror = () => saveRecord(null);
        reader.readAsDataURL(imageFile); //ye image file ko read kare ga aur convert karega base64 string me
      }
    });
  };

  const deleteScan = async (id) => {
    try {
      await fetch(`${API}/scan-history/${id}`, { method: "DELETE" });
      setHistory((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch(`${API}/scan-history`, { method: "DELETE" });
      setHistory([]);
    } catch (err) {
      console.error("Clear error:", err);
    }
  };

  return { history, loading, saveScan, deleteScan, clearHistory, fetchHistory };
}