
import { useState } from "react";
import { jsPDF } from "jspdf";
import {
  FaChartBar, FaFileAlt, FaPrint, FaCheckCircle,
  FaExclamationTriangle, FaHourglassHalf, FaBrain, FaFire,
} from "react-icons/fa";
import { FaClock } from "react-icons/fa6";

const SEVERITY_DOT = {
  Low:      "bg-yellow-400",
  Moderate: "bg-orange-400",
  High:     "bg-red-500",
  "N/A":    "bg-slate-300",
};

// PDF Generator 
async function generatePDF(patient, result, image, gradcam) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, margin = 20;
  let y = margin;

  // Header
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, W, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14); doc.setFont("helvetica", "bold");
  doc.text("MRI Scan Analysis Report", margin, 14);
  doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text("Educational Use Only - AI-Powered Analysis", W - margin, 14, { align: "right" });
  y = 32;

  // Patient info
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10); doc.setFont("helvetica", "bold");
  doc.text("Patient Information", margin + 45, y, { maxWidth: 120 });
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, W - margin, y); y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  const rows = [
    ["Name",             patient.name   || "—"],
    ["Patient ID",       patient.id     || "—"],
    ["Age / Gender",     `${patient.age || "—"} yrs / ${patient.gender || "—"}`],
    ["Date",             patient.date   || "—"],
    ["Doctor",           patient.doctor || "—"],
    ["Report Generated", new Date().toLocaleString()],
  ];
  rows.forEach(([label, value]) => {
    doc.setTextColor(100, 116, 139); doc.text(label + ":", margin, y);
    doc.setTextColor(30, 41, 59);   doc.text(String(value), margin + 45, y);
    y += 6;
  });
  y += 4;

  // Result box
  const tumorFound = result?.tumor === "Yes";
  doc.setFillColor(...(tumorFound ? [254, 226, 226] : [220, 252, 231]));
  doc.setDrawColor(...(tumorFound ? [252, 165, 165] : [134, 239, 172]));
  doc.roundedRect(margin, y, W - margin * 2, 36, 3, 3, "FD");
  doc.setFont("helvetica", "bold"); doc.setFontSize(13);
  doc.setTextColor(...(tumorFound ? [153, 27, 27] : [21, 128, 61]));
  doc.text(tumorFound ? "Tumor Detected" : "No Tumor Detected", margin + 6, y + 10);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Type: ${result?.type || result?.label || "—"}`, margin + 6,  y + 19, { maxWidth: 70 });
  doc.text(`Location: ${result?.location || "—"}`,          margin + 6,  y + 26, { maxWidth: 70 });
  doc.text(`Confidence: ${result?.confidence ?? "—"}%`,     margin + 90, y + 19);
  doc.text(`Severity: ${result?.severity || "—"}`,          margin + 90, y + 26);
  y += 44;

  //  MRI Images side by side
  const hasOriginal = !!image;
  const hasGradcam  = !!gradcam;

  if (hasOriginal || hasGradcam) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text("MRI Scan Images", margin, y); y += 5;

    if (hasOriginal && hasGradcam) {
      // Side by side
      const imgW = 75, imgH = 75, gap = 10;
      const totalW = imgW * 2 + gap;
      const startX = (W - totalW) / 2;

      try { doc.addImage(image,   "JPEG", startX,          y, imgW, imgH); } catch {}
      try { doc.addImage(gradcam, "JPEG", startX + imgW + gap, y, imgW, imgH); } catch {}

      // Labels below images
      doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Original MRI",  startX + imgW / 2,              y + imgH + 5, { align: "center" });
      doc.text("Grad-CAM (AI Attention)", startX + imgW + gap + imgW / 2, y + imgH + 5, { align: "center" });

      // Grad-CAM legend
      doc.setFontSize(7); doc.setTextColor(120, 120, 120);
      doc.text("Red = High attention  |  Blue = Low attention", W / 2, y + imgH + 11, { align: "center" });

      y += imgH + 18;
    } else {
      // Only one image
      const src = hasOriginal ? image : gradcam;
      const lbl = hasOriginal ? "Original MRI" : "Grad-CAM (AI Attention)";
      try { doc.addImage(src, "JPEG", margin, y, 70, 70); } catch {}
      doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(lbl, margin + 35, y + 74, { align: "center" });
      y += 82;
    }
  }

  // Notes
  if (result?.notes) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text("Clinical Notes", margin, y); y += 5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const lines = doc.splitTextToSize(result.notes, W - margin * 2);
    doc.text(lines, margin, y); y += lines.length * 5 + 6;
  }

  // Disclaimer
  doc.setFillColor(255, 251, 235); doc.setDrawColor(252, 211, 77);
  doc.roundedRect(margin, y, W - margin * 2, 16, 2, 2, "FD");
  doc.setFont("helvetica", "bolditalic"); doc.setFontSize(8);
  doc.setTextColor(146, 64, 14);
  doc.text(
    "This report is AI-generated for educational purposes only. Not a substitute for professional medical advice.",
    margin + 4, y + 6, { maxWidth: W - margin * 2 - 8 }
  );

  // Footer
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 285, W, 12, "F");
  doc.setFont("helvetica", "normal"); doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Generated by MRI Analyzer · AI-Powered · Educational Use Only", W / 2, 292, { align: "center" });

  return doc;
}

// History Card 
function HistoryCard({ record, onDelete }) {
  if (!record || !record.patient) return null;

  const { patient, result, image, gradcam, savedAt } = record;
  const tumorFound  = result?.tumor === "Yes";
  const [downloading, setDownloading] = useState(false);
  const [printing,    setPrinting]    = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const doc = await generatePDF(patient, result, image, gradcam);
      doc.save(`MRI_Report_${patient.name || "Patient"}_${Date.now()}.pdf`);
    } finally { setDownloading(false); }
  };

  const handlePrint = async () => {
    setPrinting(true);
    try {
      const doc    = await generatePDF(patient, result, image, gradcam);
      const blob   = doc.output("blob");
      const url    = URL.createObjectURL(blob);
      const newTab = window.open(url, "_blank");
      if (newTab) newTab.onload = () => { newTab.focus(); newTab.print(); };
    } finally { setPrinting(false); }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm  transition card_2">
      <div className="flex gap-3 md:gap-4 ">

        {/* Thumbnails  */}
        <div className="flex flex-col gap-1 shrink-0 ">
          {/* Original */}
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-black border border-slate-200 ">
            {image
              ? <img src={image} alt="MRI" className="w-full h-full object-contain" />
              : <div className="w-full h-full flex items-center justify-center text-xl">🧠</div>
            }
          </div>
          <span className="text-center text-slate-400 flex items-center justify-center gap-0.5  text-[9px] }" >
            <FaBrain  className="text-[9px]" /> Orig
          </span>

          {/* Grad-CAM */}
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border border-orange-200 bg-slate-100">
            {gradcam
              ? <img src={gradcam} alt="Grad-CAM" className="w-full h-full object-contain" />
              : <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px]" >—
              </div>
            }
          </div>
          <span className="text-center text-orange-400 flex items-center justify-center gap-0.5 text-[9px]" >
            <FaFire className="text-[8px]" /> CAM
          </span>
        </div>

        {/*Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-800 text-sm">{patient.name || "Unknown"}</span>
            <span className="text-slate-400 text-xs">#{patient.id || "—"}</span>
            <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1
              ${tumorFound ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {tumorFound
                ? <><FaExclamationTriangle /> Tumor</>
                : <><FaCheckCircle /> Clear</>}
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3 mt-1 flex-wrap">
            <span className="text-xs text-slate-500">🔬 {result?.type || result?.label || "—"}</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <FaChartBar className="text-blue-900" /> {result?.confidence ?? "—"}%
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <FaClock className="text-blue-900" />
            {new Date(savedAt).toLocaleString()}
          </p>

          {/* Action buttons */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition disabled:opacity-60 cursor-pointer"
            >
              {downloading
                ? <><FaHourglassHalf /> Generating...</>
                : <><FaFileAlt /> Download PDF</>}
            </button>

            <button
              onClick={handlePrint}
              disabled={printing}
              className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-gray-700 text-white text-xs font-semibold rounded-lg hover:bg-gray-600 transition disabled:opacity-60 cursor-pointer"
            >
              {printing
                ? <><FaHourglassHalf /> Preparing...</>
                : <><FaPrint /> Print</>}
            </button>
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(record.id)}
          className="self-start text-slate-300 hover:text-red-500 text-lg font-bold transition cursor-pointer bg-transparent border-none"
        >✕</button>
      </div>
    </div>
  );
}

export default HistoryCard;