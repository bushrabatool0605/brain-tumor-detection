
import { FaUser, FaCalendar, FaStethoscope, FaClock } from "react-icons/fa";
import { FaUserClock, FaIdBadge } from "react-icons/fa6";

function ResultHeader({ patient }) {
  const chips = [
    { icon: <FaUser />,       value: patient.name },
    { icon: <FaIdBadge />,    value: patient.id },
    { icon: <FaUserClock />,  value: `${patient.age}yr · ${patient.gender}` },
    { icon: <FaCalendar />,   value: patient.date },
    patient.doctor && { icon: <FaStethoscope />, value: patient.doctor },
  ].filter(Boolean);

  return (
    <div className="flex flex-wrap gap-2 pb-3 sm:pb-4 border-b border-slate-100">
      {chips.map((chip, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600"
        >
          <span className="text-blue-900 text-xs flex-shrink-0">{chip.icon}</span>
          <span className="font-medium truncate max-w-[80px] sm:max-w-none">{chip.value}</span>
        </div>
      ))}

      {/* Timestamp — full width on mobile, auto on larger */}
      <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-700 font-medium">
        <FaClock className="flex-shrink-0" />
        <span className="truncate">{new Date().toLocaleString()}</span>
      </div>
    </div>
  );
}

export default ResultHeader;