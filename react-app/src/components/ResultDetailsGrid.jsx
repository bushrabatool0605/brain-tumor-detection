
import { FaExclamationTriangle, FaClipboardList } from "react-icons/fa";
import { FaLocationDot, FaMicroscope, FaBolt } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";

const SEVERITY_STYLES = {
  Low:      { bg: "bg-yellow-50",  border: "border-yellow-200", text: "text-yellow-700", dot: "bg-yellow-400" },
  Moderate: { bg: "bg-orange-50",  border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-400" },
  High:     { bg: "bg-red-50",     border: "border-red-200",    text: "text-red-700",    dot: "bg-red-500"    },
  "N/A":    { bg: "bg-slate-50",   border: "border-slate-200",  text: "text-slate-500",  dot: "bg-slate-300"  },
};

function DetailCard({ label, value, icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm">
      <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">{value || "—"}</p>
    </div>
  );
}

function ResultDetailsGrid({ result }) {
  const severity = result?.severity || "N/A";
  const s = SEVERITY_STYLES[severity] || SEVERITY_STYLES["N/A"];

  return (
    <div className="flex flex-col gap-3">

      {/* 3 col grid — stacks to 1 col on very small, 3 on sm+ */}
      <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3">
        <DetailCard
          label="Location"
          value={result?.location}
          icon={<FaLocationDot className="text-blue-900 text-sm" />}
        />
        <DetailCard
          label="Tumor Type"
          value={result?.type}
          icon={<FaMicroscope className="text-blue-900 text-sm" />}
        />
        <div className={`rounded-xl p-3 sm:p-4 border shadow-sm ${s.bg} ${s.border}`}>
          <p className={`text-xs font-medium mb-1 flex items-center gap-1 ${s.text}`}>
            <FaBolt /> Severity
          </p>
          <div className="flex items-center gap-1">
            <GoDotFill className="text-red-700 " />
            <p className={`text-xs sm:text-sm font-bold ${s.text}`}>{severity}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {result?.notes && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 sm:p-4">
          <p className="text-xs text-blue-500 font-medium mb-1 flex items-center gap-1">
            <FaClipboardList className="text-blue-600 text-sm" /> Clinical Notes
          </p>
          <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">{result.notes}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 flex gap-2 items-start sm:items-center">
        <span className="text-orange-600 mt-0.5 ">
          <FaExclamationTriangle />
        </span>
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Educational use only.</strong> This AI analysis is not a medical diagnosis.
          Always consult a qualified radiologist or physician.
        </p>
      </div>

    </div>
  );
}

export default ResultDetailsGrid;