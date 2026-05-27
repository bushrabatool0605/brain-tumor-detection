
import { FaTimes, FaSearchPlus, FaBrain, FaFire, FaExclamationTriangle } from "react-icons/fa";
import { useState } from "react";

function ImageModal({ src, alt, badge, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(5,10,25,0.85)", backdropFilter: "blur(6px)" }} //dark transparent overlay
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative flex flex-col items-center w-full"
        style={{ maxWidth: 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-9 sm:-top-10 right-0 flex items-center gap-1 text-slate-400 hover:text-white text-xs sm:text-sm transition cursor-pointer bg-transparent border-none"
        >
          <FaTimes /> Close
        </button>
        <div
          className="w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{ border: "1.5px solid rgba(255,255,255,0.12)", background: "#0d1117" }}
        >
          <img src={src} alt={alt} className="w-full object-contain" style={{ maxHeight: "60vh", display: "block" }} />
        </div>
        <div
          className="mt-3 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0" }}
        >
          {badge} <span>{alt}</span>
        </div>
      </div>
    </div>
  );
}

function ConfidenceRing({ value = 0, color }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width="80" height="80" className="sm:w-24 sm:h-24">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
      <circle
        cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="40" y="40" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="13" fontWeight="700">
        {value}%
      </text>
    </svg>
  );
}

function ImageTile({ src, label, icon, accentColor, loading, onClick }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={onClick}
        disabled={!src || loading}
        className="relative group rounded-xl overflow-hidden cursor-pointer border-0 p-0 bg-transparent"
        style={{
          width: 76, height: 76,
          boxShadow: src ? `0 0 0 2px ${accentColor}33` : "0 0 0 1.5px #cbd5e1", //thin gray border
          borderRadius: 12,
        }}
      >
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1"
            style={{ background: "#f8fafc", color: "#94a3b8", fontSize: 10 }}>
            <span className="inline-block rounded-full" style={{
              width: 18, height: 18,
              border: `2px solid ${accentColor}`,
              borderTopColor: "transparent",
              animation: "spin 0.8s linear infinite",
            }} />
            <span>Loading…</span>
          </div>
        ) : src ? (
          <>
            <img src={src} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.45)" }}>
              <FaSearchPlus style={{ color: "#fff", fontSize: 16 }} />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "#f1f5f9", color: "#cbd5e1", fontSize: 11 }}>—</div>
        )}
      </button>
      <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: accentColor }}>
        {icon} {label}
      </span>
    </div>
  );
}

function ResultTumorCard({ result, previewUrl, gradcamUrl, gradcamLoading }) {
  const [modal, setModal] = useState(null);

  if (result?.type === "not_mri") {
    return (
      <div className="rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center">
        {/* Uploaded image preview */}
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Uploaded"
            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-yellow-200 shrink-0"
          />
        )}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 bg-yellow-100 text-yellow-700">
            <FaExclamationTriangle /> Invalid Image
          </div>
          <h3 className="text-sm sm:text-base font-bold text-yellow-800">Not a Brain MRI Scan</h3>
          <p className="text-xs sm:text-sm text-yellow-700 mt-1">
            {result.notes}
          </p>
          <p className="text-xs text-yellow-500 mt-2">
            Please upload a valid brain MRI image (JPG/PNG).
          </p>
        </div>
        {/* Confidence of NOT-MRI detection */}
        <div className="shrink-0">
          <ConfidenceRing value={result?.confidence ?? 0} color="#ca8a04" />
        </div>
      </div>
    );
  }

  //  Normal tumor result
  const tumorFound = result?.tumor === "Yes";

  let ringColor;
  if (!tumorFound)                         ringColor = "#16a34a"; //green
  else if (result.severity === "High")     ringColor = "#dc2626"; //red
  else if (result.severity === "Moderate") ringColor = "#ea580c"; //orange
  else                                     ringColor = "#ca8a04"; // yellow

  const TextBlock = ({ size }) => (
    <div className="flex-1 min-w-0">
      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold mb-1 whitespace-nowrap ${
        tumorFound ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
      }`}>
        {tumorFound ? "Tumor Detected" : "No Tumor"}
      </div>
      <h3 className={`${size === "sm" ? "text-sm" : "text-sm sm:text-base"} font-bold capitalize truncate`}>
        {result?.type}
      </h3>
      <p className="text-xs text-gray-500 truncate">
        {tumorFound ? "Abnormal mass found" : "Normal scan"}
      </p>
    </div>
  );

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {modal && (
        <ImageModal src={modal.src} alt={modal.alt} badge={modal.badge} onClose={() => setModal(null)} />
      )}

      <div className={`rounded-2xl border-2 p-3 sm:p-5 flex flex-col sm:flex-row gap-3 sm:gap-5 ${
        tumorFound ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
      }`}>

        <div className="flex flex-row items-center gap-3 sm:contents">
          <div className="flex gap-2 sm:gap-3 shrink-0">
            {previewUrl && (
              <ImageTile
                src={previewUrl} label="Original"
                icon={<FaBrain style={{ fontSize: 9 }} />}
                accentColor="#3b82f6" loading={false}
                onClick={() => setModal({ src: previewUrl, alt: "Original MRI", badge: <FaBrain /> })}
              />
            )}
            <ImageTile
              src={gradcamUrl} label="Grad-CAM"
              icon={<FaFire style={{ fontSize: 9 }} />}
              accentColor="#f97316" loading={gradcamLoading}
              onClick={() => gradcamUrl && !gradcamLoading &&
                setModal({ src: gradcamUrl, alt: "Grad-CAM Heatmap", badge: <FaFire /> })}
            />
          </div>

          <div className="hidden sm:block shrink-0 ml-auto">
            <ConfidenceRing value={result?.confidence ?? 0} color={ringColor} />
          </div>
        </div>

        <div className="flex flex-row items-center gap-3 sm:hidden">
          <TextBlock size="sm" />
          <div className="shrink-0">
            <ConfidenceRing value={result?.confidence ?? 0} color={ringColor} />
          </div>
        </div>

        <div className="hidden sm:block flex-1 min-w-0">
          <TextBlock size="lg" />
        </div>

      </div>
    </>
  );
}

export default ResultTumorCard;