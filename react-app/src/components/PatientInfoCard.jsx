
import { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa6";

function PatientInfoCard({ patient, setPatient, setStep }) {

  // Auto set current date on load
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setPatient((prev) => ({
      ...prev,
      date: prev.date || today,
       
    }));
  }, []);

  const handleInput = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const isValid =
    patient.name?.trim() &&
    patient.age &&
    patient.date;

  return (
    <>
      <h2 className="text-lg sm:text-xl font-bold text-blue-950">
        Patient Information
      </h2>

      <form className="p-1 sm:p-3">

        {/* Name & ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="block text-sm sm:text-md font-semibold text-slate-500 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={patient.name || ""}
              onChange={handleInput}
              placeholder="Enter Name"
              className="p-2 rounded outline-0 bg-gray-200 w-full hover:ring-2 hover:ring-blue-800 hover:bg-gray-100 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-md font-semibold text-slate-500 mb-1.5">
              Patient ID
            </label>
            <input
              name="id"
              value={patient.id || ""}
              onChange={handleInput}
              placeholder="Enter ID"
              className="p-2 rounded outline-0 w-full bg-gray-200 hover:ring-2 hover:ring-blue-800 hover:bg-gray-100 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Age, Gender, Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">

          <div>
            <label className="block text-sm sm:text-md font-semibold text-slate-500 mb-1.5">
              Age *
            </label>
            <input
              type="number"
              name="age"
              value={patient.age || ""}
              onChange={handleInput}
              placeholder="Enter Age"
              className="p-2 rounded outline-0 bg-gray-200 w-full hover:ring-2 hover:ring-blue-800 hover:bg-gray-100 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-md font-semibold text-slate-500 mb-1.5">
              Gender
            </label>
            <select
              name="gender"
              value={patient.gender || " "}
              onChange={handleInput}
              className="p-2 rounded outline-0 w-full bg-gray-200 hover:ring-2 hover:ring-blue-800 hover:bg-gray-100 text-sm sm:text-base"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm sm:text-md font-semibold text-slate-500 mb-1.5">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={patient.date || ""}
              onChange={handleInput}
              className="p-2 w-full rounded outline-0 bg-gray-200 hover:ring-2 hover:ring-blue-800 hover:bg-gray-100 text-sm sm:text-base"
            />
          </div>

        </div>

        {/* Doctor */}
        <div className="mb-2">
          <label className="block text-sm sm:text-md font-semibold text-slate-500 mb-1.5">
            Referring Doctor
          </label>
          <input
            type="text"
            name="doctor"
            value={patient.doctor || ""}
            onChange={handleInput}
            placeholder="Referral Doctor Name (Optional)"
            className="p-2 rounded outline-0 w-full bg-gray-200 hover:ring-2 hover:ring-blue-800 hover:bg-gray-100 text-sm sm:text-base"
          />
        </div>

        {/* Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={!isValid}
            className={`flex items-center justify-center gap-2 p-2.5 sm:p-3 px-6 sm:px-10 mt-4 sm:mt-6 rounded-lg shadow text-white text-sm sm:text-md font-semibold transition duration-300 active:scale-95
            ${
              isValid
                ? "bg-blue-950 hover:bg-blue-900 shadow-blue-900 hover:shadow-xl cursor-pointer hover:-translate-y-0.5 hover:shadow-blue-500/40"
                : "bg-blue-950 opacity-40 cursor-not-allowed"
            }`}
          >
            Next: Upload MRI
            <FaArrowRight />
          </button>
        </div>

      </form>
    </>
  );
}

export default PatientInfoCard;