import { FaBrain, FaUpload, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 min-h-screen bg-gray-200 p-4 md:p-8">
      <div className="bg-white min-h-screen p-5 md:p-8 rounded-xl shadow-sm">

        {/* title */}
        <h1 className="text-2xl md:text-4xl font-bold text-blue-950 mb-3 md:mb-4 leading-tight">
          Brain Tumor Detection and Classification System
        </h1>

        {/* intro */}
        <p className="text-gray-600 mb-6 md:mb-8 max-w-3xl text-sm md:text-base">
          This system uses a deep learning model to analyze brain MRI images and
          detect the presence of tumors. If a tumor is detected, the system can
          further classify the tumor type and display the prediction confidence.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">

           {/* Card 1  */}
          <div
            className="shadow-xl card_1 bg-white p-5 md:p-6 rounded-xl active:scale-97 transition duration-300 cursor-pointer hover:shadow-2xl border border-gray-100"
            onClick={() => navigate("/analyze-MRI")}
          >
            <FaBrain className="text-blue-950 text-2xl md:text-3xl mb-3" />
            <h2 className="font-semibold text-base md:text-lg mb-2">AI Tumor Detection</h2>
            <p className="text-gray-600 text-xs md:text-sm">
              Detect whether a brain tumor is present in MRI images using a
              trained deep learning model.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="shadow-xl card_1 bg-white p-5 md:p-6 rounded-xl active:scale-97 transition duration-300 cursor-pointer hover:shadow-2xl border border-gray-100"
            onClick={() => navigate("/analyze-MRI")}
          >
            <FaUpload className="text-blue-950 text-2xl md:text-3xl mb-3" />
            <h2 className="font-semibold text-base md:text-lg mb-2">Upload MRI Images</h2>
            <p className="text-gray-600 text-xs md:text-sm">
              Upload brain MRI scans in supported formats such as JPG, JPEG,
              or PNG for analysis.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="shadow-xl card_1 bg-white p-5 md:p-6 rounded-xl active:scale-97 transition duration-300 cursor-pointer hover:shadow-2xl border border-gray-100 sm:col-span-2 md:col-span-1"
            onClick={() => navigate("/history")}
          >
            <FaHistory className="text-blue-950 text-2xl md:text-3xl mb-3" />
            <h2 className="font-semibold text-base md:text-lg mb-2">Prediction History</h2>
            <p className="text-gray-600 text-xs md:text-sm">
              View and manage previous MRI analysis results in the history section.
            </p>
          </div>

        </div>

        {/* Quick Instructions */}
        <div className="bg-white rounded-xl card_1 shadow-xl p-5 md:p-6 max-w-3xl active:scale-97 transition duration-300 border border-gray-100">
          <h2 className="font-semibold text-lg md:text-xl mb-3 md:mb-4">Quick Instructions</h2>
          <ol className="list-decimal pl-5 text-gray-600 space-y-2 text-sm md:text-base">
            <li>Open <b>Analyze MRI.</b></li>
            <li>Upload a brain MRI image.</li>
            <li>Click the <b>Predict</b> button.</li>
            <li>View the tumor detection result and confidence score.</li>
          </ol>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;