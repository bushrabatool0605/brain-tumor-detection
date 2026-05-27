
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API = "/api";

function ChngPaswrd() {
  const [email, setEmail]                     = useState("admin123@gmail.com");
  const [oldPassword, setOldPassword]         = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage]                 = useState({ text: "", type: "" });
  const [loading, setLoading]                 = useState(false);

  const [showOld, setShowOld]         = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      setMessage({ text: "New password and confirm password do not match!", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters!", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/change-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email,
          old_password: oldPassword, //backend me old_password ese hain yaha odlPassword is waja se
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.detail || "Something went wrong!", type: "error" });
        return;
      }

      setMessage({ text: "Password changed successfully!", type: "success" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setMessage({ text: "Cannot connect to server. Please check if backend is running!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    //  min-h-screen hata ke w-full h-full — sidebar ke saath sahi fit hoga
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-200 p-4 py-8">
      <div className="bg-white rounded-xl shadow-xl p-5 sm:p-8 w-full max-w-sm sm:max-w-md flex flex-col items-center">

        <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-5 sm:mb-7">
          Change Password
        </h2>

        <form className="flex flex-col w-full gap-3 sm:gap-4" onSubmit={submitHandler}>

          {message.text && (
            <div className={`p-3 rounded text-xs sm:text-sm text-center ${
              message.type === "success"
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}>
              {message.text}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs sm:text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2.5 sm:p-3 rounded bg-gray-100 outline-0 text-gray-500 w-full text-sm"
            />
          </div>

          {/* Current Password */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs sm:text-sm font-semibold text-gray-600">Current Password</label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="p-2.5 sm:p-3 rounded outline-0 bg-gray-200 hover:ring-2 hover:ring-blue-800 hover:bg-gray-100 w-full pr-10 text-sm"
              />
              <button type="button" onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-800">
                {showOld ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs sm:text-sm font-semibold text-gray-600">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="p-2.5 sm:p-3 rounded outline-0 bg-gray-200 hover:ring-2 hover:ring-blue-800 hover:bg-gray-100 w-full pr-10 text-sm"
              />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-800">
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs sm:text-sm font-semibold text-gray-600">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="p-2.5 sm:p-3 rounded outline-0 bg-gray-200 hover:ring-2 hover:ring-blue-800 hover:bg-gray-100 w-full pr-10 text-sm"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-800">
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="p-2.5 sm:p-3 mt-1 rounded-lg bg-blue-950 text-white text-sm font-semibold  active:scale-95 disabled:opacity-60 w-full transition duration-300 hover:bg-blue-900 shadow-blue-900 hover:shadow-xl hover:-translate-y-0.5 hover:shadow-blue-500/40"
          >
            {loading ? "Saving..." : "Change Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="p-2.5 sm:p-3 rounded-lg border border-blue-900 text-blue-900 text-sm font-semibold hover:bg-blue-50 transition duration-300 active:scale-95 w-full "
          >
            Back to Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default ChngPaswrd;