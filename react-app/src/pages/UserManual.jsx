
import { useState } from "react";
import img3 from "../Image/img3.png";
import img4 from "../Image/img4.jpg";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";
import { FaCirclePlay } from "react-icons/fa6";
import myVideo from "../Image/video.mp4";
function UserManual() {
  const [activeTab, setActiveTab] = useState("howToUse");

  return (
    <div className="w-full min-h-screen bg-gray-200 flex justify-center p-4 md:p-6">
      <div className="bg-gray-100 w-full max-w-6xl h-fit my-4 md:my-5 p-5 md:p-10 rounded-xl shadow-xl">

        <h2 className="text-2xl md:text-4xl font-bold text-blue-950 text-center mb-6 md:mb-8">
          User Manual
        </h2>

        {/* Tabs */}
        <div className="flex gap-3 md:gap-6 justify-center mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("howToUse")}
            className={`px-4 md:px-6 py-2 rounded-t-lg font-semibold transition duration-300 text-sm md:text-base
              ${activeTab === "howToUse"
                ? "bg-blue-950 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            How to Use
          </button>
          <button
            onClick={() => setActiveTab("imageGuideLine")}
            className={`px-4 md:px-6 py-2 rounded-t-lg font-semibold transition duration-300 text-sm md:text-base
              ${activeTab === "imageGuideLine"
                ? "bg-blue-950 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            Image Guideline
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-b-lg">

          {/* How To Use */}
          {activeTab === "howToUse" && (
            <div className="p-5 md:p-8">
              <h2 className="text-blue-900 font-bold text-xl md:text-2xl mb-5 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-900 rounded-full inline-block"></span>
                How To Use
              </h2>

              <div className="flex flex-col md:flex-row gap-6 items-start">

                {/* Steps */}
                <div className="w-full md:w-2/5">
                  <ol className="space-y-2.5 text-sm md:text-base text-gray-700">
                    {[
                      "Log in using your registered email and password.",
                      "Access the Dashboard to manage MRI scans.",
                      'Click "Upload MRI" and select your image from the device.',
                      "Ensure the image is clear and follows the guidelines.",
                      "The AI model will analyze the scan automatically.",
                      "Check if a tumor is detected and view its type.",
                      "Review the results and any additional details provided.",
                      "Download the report in PDF if needed for reference.",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="min-w-7 h-7 rounded-full bg-blue-950 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-justify leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Video */}
                <div className="w-full md:w-3/5">
                  <div className="rounded-xl overflow-hidden shadow-lg border border-blue-100">
                    <div className="bg-blue-950 px-4 py-2 flex items-center gap-2">
                      <FaCirclePlay className="text-blue-300 text-sm" />
                      <span className="text-white text-xs font-medium">Demo Video</span>
                    </div>
                    <video
                      src={myVideo}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full max-h-64 object-contain bg-black"
                      onClick={(e) => {
                        if (e.target.requestFullscreen) e.target.requestFullscreen();
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Image Guidelines */}
          {activeTab === "imageGuideLine" && (
            <div className="p-5 md:p-8 text-gray-800">
              <h2 className="text-blue-900 font-bold text-xl md:text-2xl mb-4">Image Guidelines</h2>

              <ul className="space-y-2.5 text-sm md:text-base text-gray-700 mb-6">
                {[
                  "Upload high-quality MRI scans only.",
                  "Images should be in JPG or PNG format.",
                  "Ensure the brain region is clearly visible.",
                  "Remove any background clutter if possible (use transparent or clean background).",
                  "File size should be less than 5MB.",
                  "Avoid uploading images that contain marks, annotations, errors, or any extra objects.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="min-w-7 h-7 rounded-full bg-blue-950 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-justify leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Image comparison */}
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">

                {/* Bad example */}
                <div className="flex flex-col items-center gap-2">
                  <HiXCircle className="text-red-600 w-10 h-10 md:w-12 md:h-12" />
                  <div className="flex flex-col items-center bg-white rounded-lg shadow p-3 w-52 md:w-64">
                    <img src={img3} alt="MRI with marks" className="object-contain w-full max-h-44" />
                    <p className="text-xs md:text-sm text-center text-blue-900 mt-2">
                      Image with marks / errors
                    </p>
                  </div>
                </div>

                {/* Good example */}
                <div className="flex flex-col items-center gap-2">
                  <HiCheckCircle className="text-green-600 w-10 h-10 md:w-12 md:h-12" />
                  <div className="flex flex-col items-center bg-white rounded-lg shadow p-3 w-52 md:w-64">
                    <img src={img4} alt="Clean MRI" className="object-contain w-full max-h-44" />
                    <p className="text-xs md:text-sm text-center text-blue-900 mt-2">
                      Image with No marks / errors
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default UserManual;