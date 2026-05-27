import { useState } from "react";

// ── PDF DOWNLOAD ──────────────────────────────────────────────────────────────
export const downloadPDF = async (patient, result) => {
  // Step 1: jsPDF library load karo (agar pehle se nahi hai)
  if (!window.jsPDF) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  // Step 2: Naya PDF banao
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const det = result.tumor === "Yes";

  // Blue header bar
  doc.setFillColor(27, 58, 107);
  doc.rect(0, 0, 210, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Brain MRI Analysis Report", 14, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(new Date().toLocaleDateString("en-PK"), 160, 14);

  // Status badge (red ya green)
  doc.setFillColor(det ? 254 : 237, det ? 240 : 247, det ? 240 : 242);
  doc.setDrawColor(det ? 198 : 184, det ? 40 : 223, det ? 40 : 200);
  doc.roundedRect(14, 28, 65, 14, 3, 3, "FD");
  doc.setTextColor(det ? 198 : 46, det ? 40 : 125, det ? 40 : 82);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(det ? "! Tumor Detected" : "✓ No Tumor Found", 17, 37);

  // Patient info heading
  doc.setTextColor(15, 35, 71);
  doc.setFontSize(12);
  doc.text("Patient Information", 14, 56);
  doc.setLineWidth(0.5);
  doc.setDrawColor(224, 234, 244);
  doc.line(14, 58, 196, 58);

  // Patient info fields
  const info = [
    ["Patient Name", patient.name],
    ["Age", `${patient.age} years`],
    ["Gender", patient.gender],
    ["Scan Date", patient.date],
    ["Patient ID", patient.id || "—"],
    ["Referring Doctor", patient.doctor || "—"],
  ];
  doc.setFontSize(10);
  doc.setTextColor(58, 80, 104);
  info.forEach(([key, val], i) => {
    const x = i % 2 === 0 ? 14 : 110;
    const y = 70 + Math.floor(i / 2) * 12;
    doc.setFont("helvetica", "bold");
    doc.text(key + ":", x, y);
    doc.setFont("helvetica", "normal");
    doc.text(val, x + 38, y);
  });

  // Results heading
  doc.setTextColor(15, 35, 71);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Analysis Results", 14, 112);
  doc.line(14, 114, 196, 114);

  // 3 result boxes
  const boxes = [
    ["Tumor Status", result.tumor, det],
    ["Tumor Type", result.type, false],
    ["Confidence", result.confidence + "%", false],
  ];
  boxes.forEach(([label, val, isRed], i) => {
    const x = 14 + i * 62;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(224, 234, 244);
    doc.roundedRect(x, 118, 58, 32, 3, 3, "FD");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(122, 143, 168);
    doc.text(label.toUpperCase(), x + 5, 126);
    doc.setFontSize(14);
    doc.setTextColor(isRed ? 198 : 27, isRed ? 40 : 58, isRed ? 40 : 107);
    doc.text(val, x + 5, 140);
  });

  // Confidence bar
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 35, 71);
  doc.text(`Prediction Confidence: ${result.confidence}%`, 14, 166);
  doc.setFillColor(224, 234, 244);
  doc.roundedRect(14, 170, 182, 7, 2, 2, "F");
  doc.setFillColor(27, 58, 107);
  doc.roundedRect(14, 170, (182 * result.confidence) / 100, 7, 2, 2, "F");

  // Disclaimer box
  doc.setFillColor(255, 248, 225);
  doc.setDrawColor(255, 224, 130);
  doc.roundedRect(14, 186, 182, 20, 3, 3, "FD");
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(122, 95, 0);
  doc.text("Disclaimer: This result is AI-generated and for educational purposes only.", 18, 194);
  doc.text("Please consult a qualified medical professional for accurate diagnosis.", 18, 201);

  // Footer
  doc.setFillColor(245, 248, 251);
  doc.rect(0, 280, 210, 17, "F");
  doc.setFontSize(8);
  doc.setTextColor(122, 143, 168);
  doc.text("Brain MRI Analyzer  |  AI-Powered Diagnostics  |  For Educational Use Only", 14, 290);

  // Save karo
  doc.save(`MRI_Report_${patient.name.replace(/\s/g, "_")}_${patient.date}.pdf`);
};

// ── HISTORY SAVE ──────────────────────────────────────────────────────────────
export const saveToHistory = (patient, result) => {
  try {
    // Purani history nikalo
    const old = JSON.parse(localStorage.getItem("mri_history") || "[]");
    // Nayi entry banao
    const newEntry = {
      id: Date.now(),
      patient,
      result,
      timestamp: new Date().toLocaleString("en-PK"),
    };
    // Upar add karo, max 50 rakh
    const updated = [newEntry, ...old].slice(0, 50);
    // Wapis save karo
    localStorage.setItem("mri_history", JSON.stringify(updated));
  } catch {}
};

// ── INPUT STYLE (baar baar likhne se bachne ke liye) ──────────────────────────
const inp = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-800 focus:bg-white transition";

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function AnalyzeMRI() {

  // ── States ──
  const [step, setStep] = useState(0);  // konsa step dikhe: 0,1,2,3
  const [patient, setPatient] = useState({
    name: "", age: "", gender: "Male", date: "", id: "", doctor: "",
  });
  const [file, setFile] = useState(null);       // uploaded image URL
  const [fileName, setFileName] = useState(""); // image ka naam
  const [result, setResult] = useState(null);   // AI result

  // ── Handlers ──

  // Form input change
  const handleInput = (e) =>
    setPatient({ ...patient, [e.target.name]: e.target.value });

  // Image upload
  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(URL.createObjectURL(f)); // image preview ke liye
    setFileName(f.name);
  };

  // Analyze button dabaya
  const analyze = () => {
    setStep(2); // loading screen dikho
    setTimeout(() => {
      // ⚠️ ABHI FAKE RESULT HAI — baad mein FastAPI se aayega
      const res = { tumor: "Yes", type: "Glioma", confidence: 94 };
      setResult(res);
      saveToHistory(patient, res); // history mein save karo
      setStep(3); // result page dikho
    }, 2800);
  };

  // Reset — naya scan shuru karo
  const reset = () => {
    setStep(0);
    setPatient({ name: "", age: "", gender: "Male", date: "", id: "", doctor: "" });
    setFile(null);
    setFileName("");
    setResult(null);
  };

  // Button enable/disable conditions
  const step1OK = patient.name && patient.age && patient.date;
  const step2OK = !!file;
  const detected = result?.tumor === "Yes";

  // ── UI ──
  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">

      {/* Animations */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes progress { from { width: 0% } to { width: 100% } }
        .spin { animation: spin 2s linear infinite; display: inline-block; }
        .progress { animation: progress 2.8s ease forwards; }
      `}</style>

      <div className="max-w-2xl mx-auto">

        {/* Page heading */}
        <h1 className="text-2xl font-bold text-blue-950 mb-1">🧠 Analyze MRI Scan</h1>
        <p className="text-sm text-slate-400 mb-7">AI-powered tumor detection · Educational use only</p>

        {/* ───────────────────────────────────────────
            STEP 0 — Patient ki info bharo
        ─────────────────────────────────────────── */}
        {step === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
            <h2 className="text-base font-bold text-blue-950 mb-5">Patient Information</h2>

            {/* Row 1: Name + ID */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name *</label>
                <input className={inp} name="name" placeholder="e.g. Ali Raza"
                  value={patient.name} onChange={handleInput} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Patient ID</label>
                <input className={inp} name="id" placeholder="e.g. PT-001"
                  value={patient.id} onChange={handleInput} />
              </div>
            </div>

            {/* Row 2: Age + Gender + Date */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Age *</label>
                <input className={inp} name="age" type="number" placeholder="Years"
                  value={patient.age} onChange={handleInput} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Gender</label>
                <select className={inp} name="gender" value={patient.gender} onChange={handleInput}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Scan Date *</label>
                <input className={inp} name="date" type="date"
                  value={patient.date} onChange={handleInput} />
              </div>
            </div>

            {/* Row 3: Doctor */}
            <div className="mb-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Referring Doctor</label>
              <input className={inp} name="doctor" placeholder="e.g. Dr. Hassan Mirza"
                value={patient.doctor} onChange={handleInput} />
            </div>

            {/* Next button */}
            <div className="flex justify-end mt-5">
              <button
                onClick={() => step1OK && setStep(1)}
                className={`px-6 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg transition
                  ${step1OK ? "hover:bg-blue-800 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}>
                Next: Upload MRI →
              </button>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────
            STEP 1 — MRI image upload karo
        ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
            <h2 className="text-base font-bold text-blue-950 mb-4">Upload MRI Scan</h2>

            {/* Patient summary chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                `👤 ${patient.name}`,
                `🎂 ${patient.age}yr · ${patient.gender}`,
                `📅 ${patient.date}`,
                patient.doctor && `🩺 ${patient.doctor}`,
              ]
                .filter(Boolean)
                .map((chip) => (
                  <span key={chip} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs text-slate-600">
                    {chip}
                  </span>
                ))}
            </div>

            {/* Upload box */}
            <div className={`relative h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer mb-3 transition
              ${file ? "border-blue-800 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-blue-700 hover:bg-blue-50"}`}>

              {/* Agar image upload hui toh preview, warna instructions */}
              {file ? (
                <img src={file} alt="MRI" className="w-full h-full object-contain p-2 rounded-xl" />
              ) : (
                <>
                  <span className="text-4xl">🧠</span>
                  <p className="font-semibold text-blue-950 text-sm">Drop MRI scan here</p>
                  <p className="text-xs text-slate-400">or click to browse · JPG, PNG</p>
                </>
              )}

              {/* Hidden file input — poore box pe click kaam karta hai */}
              <input type="file" accept="image/*" onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            {/* File naam bar */}
            {file && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg mb-2">
                <span>🖼️</span>
                <span className="flex-1 text-sm font-medium text-blue-800 truncate">{fileName}</span>
                <button
                  onClick={() => { setFile(null); setFileName(""); }}
                  className="text-slate-300 hover:text-red-500 text-base font-bold bg-transparent border-none cursor-pointer">
                  ✕
                </button>
              </div>
            )}

            {/* Back + Analyze buttons */}
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setStep(0)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:border-blue-800 hover:text-blue-800 cursor-pointer transition">
                ← Back
              </button>
              <button
                onClick={() => step2OK && analyze()}
                className={`px-6 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg transition
                  ${step2OK ? "hover:bg-blue-800 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}>
                🔬 Analyze MRI
              </button>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────
            STEP 2 — Loading / Analyzing screen
        ─────────────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
            <div className="flex flex-col items-center py-12 gap-4">
              <span className="text-5xl spin">🧠</span>
              <p className="text-lg font-bold text-blue-950">Analyzing MRI Scan...</p>
              <p className="text-sm text-slate-400">AI model is processing · Please wait</p>
              {/* Progress bar */}
              <div className="w-60 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-gradient-to-r from-blue-900 to-sky-400 rounded-full progress" />
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────
            STEP 3 — Result dikhao
        ─────────────────────────────────────────── */}
        {step === 3 && result && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
            <h2 className="text-base font-bold text-blue-950 mb-5">Analysis Complete</h2>

            {/* Status banner — red ya green */}
            <div className={`flex items-center gap-3 p-4 rounded-xl border mb-5
              ${detected ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
              <span className="text-3xl">{detected ? "⚠️" : "✅"}</span>
              <div>
                <p className={`text-lg font-bold ${detected ? "text-red-700" : "text-green-700"}`}>
                  {detected ? "Tumor Detected" : "No Tumor Found"}
                </p>
                <p className="text-sm text-slate-400 mt-0.5">
                  Patient: {patient.name} · {patient.date}
                </p>
              </div>
            </div>

            {/* MRI image preview */}
            {file && (
              <img src={file} alt="MRI"
                className="w-full max-h-44 object-contain rounded-xl border border-slate-200 bg-slate-50 mb-5 p-2" />
            )}

            {/* 3 stat boxes */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Tumor Status", val: result.tumor, color: detected ? "text-red-700" : "text-green-700", sub: "AI Prediction" },
                { label: "Tumor Type",   val: result.type,  color: "text-blue-900", sub: "Classification" },
                { label: "Confidence",   val: result.confidence + "%", color: "text-blue-900", sub: "Model Score" },
              ].map(({ label, val, color, sub }) => (
                <div key={label} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</p>
                  <p className={`text-xl font-bold ${color}`}>{val}</p>
                  <p className="text-xs text-slate-300 mt-1">{sub}</p>
                </div>
              ))}
            </div>

            {/* Confidence bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                <span>Prediction Confidence</span>
                <span>{result.confidence}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-900 to-sky-400 rounded-full transition-all duration-1000"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            {/* Warning */}
            <div className="flex gap-2.5 p-3 bg-yellow-50 border border-yellow-200 rounded-xl mb-5">
              <span>⚠️</span>
              <p className="text-xs text-yellow-700 leading-relaxed">
                This result is AI-generated and for educational purposes only.
                Please consult a qualified medical professional for accurate diagnosis.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3">
              <button onClick={reset}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:border-blue-800 hover:text-blue-800 cursor-pointer transition">
                + New Scan
              </button>
              <button onClick={() => downloadPDF(patient, result)}
                className="px-6 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 cursor-pointer transition">
                📄 Download PDF Report
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
