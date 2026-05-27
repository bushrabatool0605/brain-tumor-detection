
import { FaUser, FaCalendar, FaStethoscope } from "react-icons/fa";
import { FaUserClock, FaIdBadge, FaRegImage } from "react-icons/fa6";
import { FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import { GiMicroscope } from "react-icons/gi";

function UploadImg({ patient, setStep, file, setFile }) {

  const chips = [
    { icon: <FaUser />,       value: patient.name },
    { icon: <FaIdBadge />,    value: patient.id },
    { icon: <FaUserClock />,  value: `${patient.age}yr · ${patient.gender}` },
    { icon: <FaCalendar />,   value: patient.date },
    patient.doctor && { icon: <FaStethoscope />, value: patient.doctor },
  ].filter(Boolean);

  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
  };

  const handleAnalyze = () => {
    if (!file) {
      alert("Please upload an MRI image first!");
      return;
    }
    setStep(2);
  };

  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <>
      <h2 className="text-lg sm:text-2xl text-blue-950 font-bold">Upload MRI Image</h2>

      {/* Patient chips */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mt-3 sm:mt-4">
        {chips.map((chip, i) => (
          <div
            key={i}
            className="px-2 sm:px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs text-slate-600 flex items-center gap-1.5 sm:gap-2"
          >
            <span className="text-blue-950">{chip.icon}</span>
            <span className="truncate max-w-[100px] sm:max-w-none">{chip.value}</span>
          </div>
        ))}
      </div>

      {/* Upload box — centered, full width on mobile */}
      <div
        className={`relative mt-4 mx-auto w-full max-w-xs sm:w-60 h-48 sm:h-56 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer mb-3 transition
          ${file ? "border-blue-800 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-blue-700 hover:bg-blue-50"}`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="MRI" className="w-full h-full object-contain p-2 rounded-xl" />
        ) : (
          <>
            <span className="text-3xl sm:text-4xl">🧠</span>
            <p className="font-semibold text-blue-950 text-sm">Drop MRI scan here</p>
            <p className="text-xs text-slate-400">or click to browse · JPG, PNG</p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>

      {/* File name bar */}
      {file && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg mb-2">
          <FaRegImage className="text-lg sm:text-xl text-blue-950 " />
          <span className="flex-1 text-xs sm:text-sm font-medium text-blue-800 truncate">{file.name}</span>
          <button
            onClick={() => setFile(null)}
            className="text-slate-300 hover:text-red-500 bg-transparent border-none cursor-pointer "
          >
            <FaTimesCircle className="text-xl sm:text-2xl text-blue-950" />
          </button>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-5">
        <button
          onClick={() => setStep(0)}
          className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white border border-slate-200 text-slate-600 text-xs sm:text-sm font-medium rounded-lg hover:border-blue-800 hover:text-blue-800 cursor-pointer transition"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <FaArrowLeft />
            <span>Back</span>
          </div>
        </button>
        <button
          onClick={handleAnalyze}
          className={`px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-950 text-white text-xs sm:text-sm font-semibold rounded-lg 
            transition duration-300 hover:bg-blue-900 shadow-blue-900 hover:shadow-xl hover:-translate-y-0.5 hover:shadow-blue-500/40
            ${file ? "hover:bg-blue-800 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <GiMicroscope className="text-base sm:text-xl" />
            <span>Analyze MRI</span>
          </div>
        </button>
      </div>
    </>
  );
}

export default UploadImg;