import { useEffect, useState } from "react";

function Loading({ setStep, file, setResult }) {
  const [statusMsg, setStatusMsg] = useState("Preparing image...");

  useEffect(() => {
    const analyze = async () => {
      try {
        setStatusMsg("Sending to AI model...");

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/analyze", {
          method: "POST",
          body: formData,// iamge bej re
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json(); //data convert hora JS object me

        
        if (data.type === "not_mri") {
          setResult({
            tumor:      "N/A",
            type:       "not_mri",
            confidence: data.confidence ?? 0,
            location:   "N/A",
            severity:   "N/A",
            notes:      data.notes ?? "The uploaded image does not appear to be a brain MRI scan.",
          });
          setStep(3);
          return;
        }

        setResult(data);
        setStep(3);

      } catch (err) {
        console.error("Analysis failed:", err);
        setResult({
          tumor:      "Unknown",
          type:       "error",
          confidence: 0,
          location:   "N/A",
          severity:   "N/A",
          notes:      "Could not connect to the backend. Please ensure the FastAPI server is running on port 8000.",
        });
        setStep(3);
      }
    };

    analyze(); //function ko run krne ke liye
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 py-12 sm:py-20 px-4">
      <span className="text-4xl sm:text-5xl animate-spin inline-block">🧠</span>
      <p className="text-base sm:text-lg font-bold text-blue-950 text-center">
        Analyzing MRI Scan...
      </p>
      <p className="text-xs sm:text-sm text-gray-400 text-center">{statusMsg}</p>
    </div>
  );
}

export default Loading;