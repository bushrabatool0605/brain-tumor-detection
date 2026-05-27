
// import { useState } from "react";
// import { FaClockRotateLeft } from "react-icons/fa6";
// import { useScanHistory } from "../hooks/useScanHistory";
// import HistoryCard from "../components/HistoryCard";
// import { FaBrain, FaExclamationTriangle, FaCheckCircle, FaFolderOpen } from "react-icons/fa";

// function History() {
//   const { history, deleteScan, clearHistory } = useScanHistory();
//   const [search, setSearch] = useState("");

//   const tumorCount = history.filter((r) => r.result?.tumor === "Yes").length;
//     // array 
//     includes("")
// //HAMESHA true deta hai 
// //Kyuki empty text har string ke andar hota hai.
//   const filteredHistory = history.filter((record) => { //yahan record loop me name  ek ek karke change hota hai
//     const searchText = search.toLowerCase();
//    //filter() khud decide karta hai ke item array me add karna hai ya nahi — based on return true/false
//     const name =
//       record.name ||
//       record.patient?.name ||
//       "";

//     return name.toLowerCase().includes(searchText); // include() yeah check krta ke serchtext me jo naam wo name variable me hain ya ni  
//     //    then   me array  add ho jae ga
    
//   });

//   return (
//     <div className="w-full bg-gray-200 flex flex-col items-center min-h-screen">
//       <div className="w-full max-w-5xl  p-4 md:p-8 mt-6 md:mt-10 mb-10">
//         <div className="bg-gray-100 rounded-xl shadow-xl p-4 md:p-8 ">

//           {/* Header */}
//           <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
//             <div className="flex items-center gap-2">
//               <FaClockRotateLeft className="text-blue-950 text-xl" />
//               <h2 className="text-xl md:text-2xl font-bold text-blue-950">
//                 Scan History
//               </h2>
//             </div>

//             {history.length > 0 && (
//               <button
//                 onClick={() => {
//                   if (window.confirm("Clear all history?")) clearHistory();
//                 }}
//                 className="text-xs text-red-400 hover:text-red-600 underline cursor-pointer bg-transparent border-none"
//               >
//                 Clear All
//               </button>
//             )}
//           </div>

//           <p className="text-gray-500 text-sm mb-4 md:mb-6">
//             {history.length} scan{history.length !== 1 ? "s" : ""}
//             {tumorCount > 0 &&
//               ` · ${tumorCount} tumor detection${tumorCount !== 1 ? "s" : ""}`}
//           </p>


//           {/* Stats */}
//           {history.length > 0 && (
//             <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
//               <StatCard
//                 label="Total Scans"
//                 value={history.length}
//                 icon={<FaBrain className="w-6 h-6 text-blue-500" />}
//                 color="blue"
//               />

//               <StatCard
//                 label="Tumors Found"
//                 value={tumorCount}
//                 icon={<FaExclamationTriangle className="w-6 h-6 text-red-500" />}
//                 color="red"
//               />

//               <StatCard
//                 label="Clear Scans"
//                 value={history.length - tumorCount}
//                 icon={<FaCheckCircle className="w-6 h-6 text-green-500" />}
//                 color="green"
//               />
//             </div>
//           )}
          
//           {/* Search Bar */}
//           {history.length > 0 && (
//             <input
//               type="text"
//               placeholder="Search by patient name..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full mb-4 md:mb-6 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-950"
//             />
//           )}

//           {/* List */}
//           <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 flex flex-col gap-3 ">
//             {filteredHistory.length === 0 ? (
//               <div className="flex flex-col items-center gap-3 py-12 md:py-16 text-center">
//                 <FaFolderOpen className="text-xl text-blue-950" />
//                 <p className="text-slate-500 font-medium">
//                   No matching scans found
//                 </p>
//                 <p className="text-slate-400 text-sm">
//                   Try searching a patient name
//                 </p>
//               </div>
//             ) : (
//               filteredHistory.map((record) => (
//                 <HistoryCard 
//                   key={record.id}
//                   record={record}
//                   onDelete={deleteScan}
//                 />
//               ))
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ label, value, icon, color }) {
//   const colors = {
//     blue: "bg-blue-50 border-blue-100 text-blue-800",
//     red: "bg-red-50 border-red-100 text-red-800",
//     green: "bg-green-50 border-green-100 text-green-800",
//   };

//   return (
//     <div
//       className={`rounded-xl border p-3 md:p-4 text-center flex flex-col items-center justify-center ${colors[color]}`}
//     >
//       <p className="text-xl md:text-2xl">{icon}</p>
//       <p className="text-xl md:text-2xl font-black mt-1">{value}</p>
//       <p className="text-xs font-medium mt-0.5 opacity-70">{label}</p>
//     </div>
//   );
// }

// export default History;
import { useState } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { useScanHistory } from "../hooks/useScanHistory";
import HistoryCard from "../components/HistoryCard";
import {
  FaBrain,
  FaExclamationTriangle,
  FaCheckCircle,
  FaFolderOpen,
} from "react-icons/fa";

function History() {
  const { history, deleteScan, clearHistory } = useScanHistory();
  const [search, setSearch] = useState("");

  // Admin check
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="w-full bg-gray-200 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white rounded-xl shadow-xl p-10 max-w-md w-full mx-4 text-center border-t-4 border-red-600">
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-blue-950 mb-2">
            Access Denied
          </h2>

          <p className="text-gray-500 text-sm">
            You are not authorized to view this page.
            Only admins can access Scan History.
          </p>
        </div>
      </div>
    );
  }

  // FIXED
  const tumorCount = history.filter(
    (r) => r.tumor_detected === "Yes"
  ).length;

  // FIXED
  const filteredHistory = history.filter((record) => {
    const searchText = search.toLowerCase();

    const name = record.patient_name || "";

    return name.toLowerCase().includes(searchText);
  });

  return (
    <div className="w-full bg-gray-200 flex flex-col items-center min-h-screen">
      <div className="w-full max-w-5xl p-4 md:p-8 mt-6 md:mt-10 mb-10">
        <div className="bg-gray-100 rounded-xl shadow-xl p-4 md:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FaClockRotateLeft className="text-blue-950 text-xl" />

              <h2 className="text-xl md:text-2xl font-bold text-blue-950">
                Scan History
              </h2>
            </div>

            {history.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Clear all history?")) {
                    clearHistory();
                  }
                }}
                className="text-xs text-red-400 hover:text-red-600 underline cursor-pointer bg-transparent border-none"
              >
                Clear All
              </button>
            )}
          </div>

          <p className="text-gray-500 text-sm mb-4 md:mb-6">
            {history.length} scan{history.length !== 1 ? "s" : ""}

            {tumorCount > 0 &&
              ` · ${tumorCount} tumor detection${
                tumorCount !== 1 ? "s" : ""
              }`}
          </p>

          {/* Stats */}
          {history.length > 0 && (
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">

              <StatCard
                label="Total Scans"
                value={history.length}
                icon={<FaBrain className="w-6 h-6 text-blue-500" />}
                color="blue"
              />

              <StatCard
                label="Tumors Found"
                value={tumorCount}
                icon={
                  <FaExclamationTriangle className="w-6 h-6 text-red-500" />
                }
                color="red"
              />

              <StatCard
                label="Clear Scans"
                value={history.length - tumorCount}
                icon={<FaCheckCircle className="w-6 h-6 text-green-500" />}
                color="green"
              />
            </div>
          )}

          {/* Search */}
          {history.length > 0 && (
            <input
              type="text"
              placeholder="Search by patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-4 md:mb-6 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
          )}

          {/* History List */}
          <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 flex flex-col gap-3">

            {filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 md:py-16 text-center">
                <FaFolderOpen className="text-xl text-blue-950" />

                <p className="text-slate-500 font-medium">
                  No matching scans found
                </p>

                <p className="text-slate-400 text-sm">
                  Try searching a patient name
                </p>
              </div>
            ) : (
              filteredHistory.map((record) => (
                <HistoryCard
                  key={record.id}
                  record={record}
                  onDelete={deleteScan}
                />
              ))
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-100 text-blue-800",
    red: "bg-red-50 border-red-100 text-red-800",
    green: "bg-green-50 border-green-100 text-green-800",
  };

  return (
    <div
      className={`rounded-xl border p-3 md:p-4 text-center flex flex-col items-center justify-center ${colors[color]}`}
    >
      <p className="text-xl md:text-2xl">{icon}</p>

      <p className="text-xl md:text-2xl font-black mt-1">
        {value}
      </p>

      <p className="text-xs font-medium mt-0.5 opacity-70">
        {label}
      </p>
    </div>
  );
}

export default History;