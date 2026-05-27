import React from "react";

function HowToUse() {
  return (
    <div className="w-full bg-gray-100 min-h-screen flex justify-center p-6 pt-20">
      <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-blue-900 mb-6 text-center">
          How to Use
        </h1>

        <div className="space-y-6 text-gray-700 text-justify leading-relaxed">

          <div className="flex gap-4 items-start">
            <img src="/images/login.png" alt="Login Screenshot" className="w-32 rounded-lg shadow-md"/>
            <p><strong>Step 1:</strong> Login to the system with your credentials.</p>
          </div>

          <div className="flex gap-4 items-start">
            <img src="/images/upload.png" alt="Upload Section" className="w-32 rounded-lg shadow-md"/>
            <p><strong>Step 2:</strong> Go to “Upload MRI” from the sidebar and select the MRI image you want to analyze.</p>
          </div>

          <div className="flex gap-4 items-start">
            <img src="/images/predict.png" alt="Predict Button" className="w-32 rounded-lg shadow-md"/>
            <p><strong>Step 3:</strong> Click “Predict” to generate the results. Wait for the confidence scores to appear.</p>
          </div>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 px-4 py-2 rounded">
            ⚠ After prediction, always consult a qualified doctor. Do not rely solely on AI results for medical decisions.
          </div>

        </div>
      </div>
    </div>
  );
}

export default HowToUse;