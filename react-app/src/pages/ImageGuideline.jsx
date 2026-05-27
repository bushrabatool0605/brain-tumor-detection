import React from "react";

function ImageGuidelines() {
  return (
    <div className="w-full bg-gray-100 min-h-screen flex justify-center p-6 pt-20">
      <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-blue-900 mb-6 text-center">
          Image Guidelines
        </h1>

        <div className="space-y-6 text-gray-700 text-justify leading-relaxed">

          <div className="flex gap-4 items-start">
            <img src="/images/mri_good.png" alt="Good MRI Example" className="w-32 rounded-lg shadow-md"/>
            <p><strong>Format:</strong> Use JPEG or PNG images only.</p>
          </div>

          <div className="flex gap-4 items-start">
            <img src="/images/mri_resolution.png" alt="Resolution Example" className="w-32 rounded-lg shadow-md"/>
            <p><strong>Resolution:</strong> Minimum 256x256 pixels. Higher resolution improves AI prediction accuracy.</p>
          </div>

          <div className="flex gap-4 items-start">
            <img src="/images/mri_marks.png" alt="Marked / Watermarked" className="w-32 rounded-lg shadow-md"/>
            <p className="text-red-600 font-semibold">
              ⚠ Avoid images with marks, annotations, or watermarks. These can affect AI predictions and reduce accuracy.
            </p>
          </div>

          <div className="flex gap-4 items-start">
            <img src="/images/mri_orientation.png" alt="Orientation Example" className="w-32 rounded-lg shadow-md"/>
            <p><strong>Orientation:</strong> Ensure the brain is centered and properly aligned. Blurry or tilted images reduce prediction quality.</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ImageGuidelines;