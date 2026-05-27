
import { FaBrain } from "react-icons/fa6";
import { useState } from "react";
import PatientInfoCard from "../components/PatientInfoCard";
import UploadImg from "../components/UploadImg";
import Loading from "../components/Loading";
import Result from "../components/Result";
import { useScanHistory } from "../hooks/useScanHistory";

function AnalyzeMRI() {
  const [patient, setPatient] = useState({
    name: "",
    id: "",
    age: "",
    gender: "Male",
    date: "",
    doctor: "",
  });

  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null); // for file save
  const [result, setResult] = useState(null); // for result save

  const { saveScan } = useScanHistory();

  const handleSaveHistory = async (gradcamUrl) => {
    console.log("GradCAM received in AnalyzeMRI:", gradcamUrl);
    await saveScan(patient, result, file, gradcamUrl);
  };

  return (
    <div className="w-full min-h-screen bg-gray-200 flex flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-gray-100 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl p-4 sm:p-6 md:p-8 rounded-xl shadow-xl mt-4 sm:mt-6 md:mt-10">

        {/* Header */}
        <div className="flex gap-2 items-center mb-1">
          <FaBrain className="text-blue-950 text-xl sm:text-2xl " />
          <h2 className="text-xl sm:text-2xl font-bold text-blue-950">
            Analyze MRI Scan
          </h2>
        </div>

        <p className="mt-1 mb-3 text-sm sm:text-base text-gray-600"> 
          AI Powered tumor detection. Educational use only.
        </p>

        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-xl mt-4 mb-6 sm:mb-8 md:mb-10">

          {/* STEP 0: Patient Info */}
          {step === 0 && (
            <PatientInfoCard
              patient={patient}
              setPatient={setPatient}
              setStep={setStep}
            />
          )}

          {/* STEP 1: Upload */}
          {step === 1 && (
            <UploadImg
              patient={patient}
              setStep={setStep}
              file={file}
              setFile={setFile}
            />
          )}

          {/* STEP 2: Loading */}
          {step === 2 && (
            <Loading
              setStep={setStep}
              file={file}
              setResult={setResult}
            />
          )}

          {/* STEP 3: Result */}
          {step === 3 && (
            <Result
              patient={patient}
              result={result}
              file={file}
              setStep={setStep}
              setFile={setFile}
              setResult={setResult}
              setPatient={setPatient}
              onSaveHistory={handleSaveHistory}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default AnalyzeMRI;