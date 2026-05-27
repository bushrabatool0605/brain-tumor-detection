
import { FaPrint, FaFilePdf, FaHourglassHalf } from "react-icons/fa6";
import { useState } from "react";
import { jsPDF } from "jspdf";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

async function generatePDF(patient, result, image, gradcam) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, margin = 20;
  let y = margin;

  const originalImg = image ? await toBase64(image) : null;
  const gradcamImg  = gradcam || null;
  const hasOriginal = !!originalImg;
  const hasGradcam  = !!gradcamImg;

  // Header
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, W, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14); doc.setFont("helvetica", "bold");
  doc.text("MRI Scan Analysis Report", margin, 14);
  doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text("Educational Use Only - AI-Powered Analysis", W - margin, 14, { align: "right" });
  y = 32;

  // Patient Info
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10); doc.setFont("helvetica", "bold");
  doc.text("Patient Information", margin, y);
  y += 6;

  const rows = [
    ["Name",             patient.name   || "—"],
    ["Patient ID",       patient.id     || "—"],
    ["Age / Gender",     `${patient.age || "—"} / ${patient.gender || "—"}`],
    ["Date",             patient.date   || "—"],
    ["Doctor",           patient.doctor || "—"],
    ["Report Generated", new Date().toLocaleString()],
  ];

  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  rows.forEach(([label, value]) => {
    doc.setTextColor(100, 116, 139); doc.text(label + ":", margin, y);
    doc.setTextColor(30, 41, 59);   doc.text(String(value), margin + 45, y);
    y += 6;
  });
  y += 5;

  // Result Box
  const tumorFound = result?.tumor === "Yes";
  doc.setFillColor(tumorFound ? 254 : 220, tumorFound ? 226 : 252, tumorFound ? 226 : 231);
  doc.setDrawColor(tumorFound ? 252 : 134, tumorFound ? 165 : 239, tumorFound ? 165 : 172);
  doc.roundedRect(margin, y, W - margin * 2, 36, 3, 3, "FD");
  doc.setFont("helvetica", "bold"); doc.setFontSize(13);
  doc.setTextColor(tumorFound ? 153 : 21, tumorFound ? 27 : 128, tumorFound ? 27 : 61);
  doc.text(tumorFound ? "Tumor Detected" : "No Tumor Detected", margin + 6, y + 10);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Type: ${result?.type || "—"}`,           margin + 6,  y + 19);
  doc.text(`Location: ${result?.location || "—"}`,   margin + 6,  y + 26);
  doc.text(`Confidence: ${result?.confidence || "—"}%`, margin + 90, y + 19);
  doc.text(`Severity: ${result?.severity || "—"}`,   margin + 90, y + 26);
  y += 44;

  // Images
  if (hasOriginal || hasGradcam) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text("MRI Scan Images", margin, y); y += 5;

    const imgW = 75, imgH = 75, gap = 10;

    if (hasOriginal && hasGradcam) {
      const startX = (W - (imgW * 2 + gap)) / 2;
      doc.addImage(originalImg, "JPEG", startX, y, imgW, imgH);
      doc.addImage(gradcamImg,  "JPEG", startX + imgW + gap, y, imgW, imgH);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Original MRI", startX + imgW / 2, y + imgH + 5, { align: "center" });
      doc.text("Grad-CAM (AI Attention)", startX + imgW + gap + imgW / 2, y + imgH + 5, { align: "center" });
      doc.setFontSize(7); doc.setTextColor(120, 120, 120);
      doc.text("Red = High attention  |  Blue = Low attention", W / 2, y + imgH + 11, { align: "center" });
    } else {
      const src = hasOriginal ? originalImg : gradcamImg;
      const lbl = hasOriginal ? "Original MRI" : "Grad-CAM (AI Attention)";
      doc.addImage(src, "JPEG", margin, y, 75, 75);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(lbl, margin + 37.5, y + 79, { align: "center" });
    }
    y += 88;
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
    "AI-generated report for educational use only. Not medical advice.",
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

function ResultActions({ patient, result, image, gradcam }) {
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
      const doc  = await generatePDF(patient, result, image, gradcam);
      const blob = doc.output("blob"); //PDF ko raw binary data (Blob) mein convert krna
      const url  = URL.createObjectURL(blob);
      const win  = window.open(url, "_blank");
      if (win) win.onload = () => { win.focus(); win.print(); };
    } finally { setPrinting(false); }
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-end flex-wrap">
      <button
        onClick={handlePrint}
        disabled={printing}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-200 transition cursor-pointer border border-slate-300 disabled:opacity-50"
      >
        <FaPrint /> <span>{printing ? "Opening..." : "Print"}</span>
      </button>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-white
          transition duration-300 hover:bg-blue-900 shadow-blue-900 hover:shadow-xl hover:-translate-y-0.5 hover:shadow-blue-500/40
          ${downloading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-950  cursor-pointer"}`}
      >
        {downloading
          ? <><FaHourglassHalf /> <span>Generating...</span></>
          : <><FaFilePdf />       <span>Download PDF</span></>
        }
      </button>
    </div>
  );
}

export default ResultActions;