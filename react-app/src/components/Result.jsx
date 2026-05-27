
import { FaLongArrowAltLeft, FaCheckSquare, FaExclamationTriangle } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import ResultHeader from "./ResultHeader";
import ResultTumorCard from "./ResultTumorCard";
import ResultDetailsGrid from "./ResultDetailsGrid";
import ResultActions from "./ResultActions";

function Result({ patient, result, file, setStep, setFile, setResult, setPatient, onSaveHistory }) {
  const previewUrl = file ? URL.createObjectURL(file) : null;
  const savedRef = useRef(false);
  const [gradcamUrl, setGradcamUrl] = useState(null);
  const [gradcamLoading, setGradcamLoading] = useState(false);

  useEffect(() => {
    if (!file || !result) return;
    if (savedRef.current) return;

    if (result.type === "not_mri") return;

    
    setGradcamLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    fetch("/gradcam", { method: "POST", body: formData })
      .then((r) => r.json())
      .then((data) => {
        const url = data.gradcam_image || null;
        setGradcamUrl(url);
        if (onSaveHistory && !savedRef.current) {
          savedRef.current = true;
          onSaveHistory(url);
        }
      })
      .catch((err) => {
        console.error("Grad-CAM error:", err);
        if (onSaveHistory && !savedRef.current) {
          savedRef.current = true;
          onSaveHistory(null);
        }
      })
      .finally(() => setGradcamLoading(false));
  }, [result]);

  const handleNewScan = () => {
    setStep(0);
    setFile(null);
    setResult(null);
    setGradcamUrl(null);
    if (setPatient) {
      setPatient({ name: "", id: "", age: "", gender: "Male", date: "", doctor: "" });
    }
  };

  const isNotMri = result?.type === "not_mri";

  return (
    <div className="flex flex-col gap-4 sm:gap-5">

      {/* Header row */}
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl sm:text-2xl text-blue-950 font-black">Analysis Report</h2>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">AI</span>

        {/* Show "Saved" badge only for real MRI scans */}
        {!isNotMri && (
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex gap-1 items-center">
            <FaCheckSquare /> Saved
          </span>
        )}

        {/* Show warning badge for non-MRI */}
        {isNotMri && (
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex gap-1 items-center">
            <FaExclamationTriangle /> Invalid Image
          </span>
        )}
      </div>

      <ResultHeader patient={patient} />

      <ResultTumorCard
        result={result}
        previewUrl={previewUrl}
        gradcamUrl={gradcamUrl}
        gradcamLoading={gradcamLoading}
      />

      {/* Hide details and actions for non-MRI images */}
      {!isNotMri && (
        <>
          <ResultDetailsGrid result={result} />
          <ResultActions patient={patient} result={result} image={file} gradcam={gradcamUrl} />
        </>
      )}

      <button
        onClick={handleNewScan}
        className="flex items-center gap-2 self-start text-xs sm:text-sm text-slate-400 hover:text-blue-900 transition underline underline-offset-2 cursor-pointer bg-transparent border-none mt-1"
      >
        <FaLongArrowAltLeft /> {isNotMri ? "Try again with correct image" : "Start new scan"}
      </button>
    </div>
  );
}

export default Result;