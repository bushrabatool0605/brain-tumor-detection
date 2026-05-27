// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import img2 from "../Image/img1.png";
// import { FaRobot,FaBrain, FaEye, FaEyeSlash } from "react-icons/fa";

// const API = "http://localhost:8000/api";

// function LogIn() {
//   const [email, setEmail]       = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError]       = useState("");
//   const [loading, setLoading]   = useState(false);
//   const [showPass, setShowPass] = useState(false);

//   const navigate = useNavigate();

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     // pehle ka koi error to use remove krna
//     setError("");
//     setLoading(true);

//     try {
//       // Await ka matlab JS wait karta ha jb tk backend response na de
//       // ${API}/login > backend ka login URL
//       const res = await fetch(`${API}/login`, {
//         // method=POST > data bhj rahe hain backend ko
//         method:  "POST",
//         // yeah btata hain content ki type kya hain
//         headers: { "Content-Type": "application/json" }, 
//         // JSON.stringify() ye  karta hai → object → JSON string
//         //  HTTP request body me direct JS object nahi bhej sakte, backend ko string chahiye
//        //  JSON.stringify() → object ko string me convert karta hai
//       //  Object → JS me data store karne ka tarika
//       // JSON.stringify() → object ko string banake backend ko bhejna
//         body:    JSON.stringify({ email, password }),
//       });
        
//       const data = await res.json(); // Json data ko ks object me kre ga convert

//       if (!res.ok) {
//         setError(data.detail || "Login failed!");
//         return;
//       }

//       sessionStorage.setItem("user", JSON.stringify(data.user));
//       // Backend se login successful hone ke baad, disclaimer ka purana value remove kar diya
//     // kyun? → Taaki user dobara disclaimer page dekhe
//     // Agar remove na karo → browser ko lagega “user ne pehle hi disclaimer accept kar diya”
//       sessionStorage.removeItem("disclaimer_accepted");
//       navigate("/disclaimer-gate");

//     } catch (err) {
//       setError("Cannot connect to server. Please make sure the backend is running!");
//     } finally {
//       setLoading(false);
//       setEmail("");
//       setPassword("");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-4xl flex flex-col md:flex-row rounded-xl shadow-xl overflow-hidden">

//         {/* Left Side — hidden on small screens */}
//         <div className="hidden md:flex md:w-1/2 flex-col">
//           <div className="flex-1">
//             <img
//               src={img2}
//               alt="Example MRI"
//               className="object-contain w-full h-64 md:h-80 lg:h-96 float"
//             />
//           </div>
//           <div className="bg-blue-800 flex flex-col p-4 items-center">
//             <div className="flex justify-center items-center gap-3">
//               <FaRobot className="text-3xl text-white" />
//               <h2 className="text-xl font-bold text-white">AI Model</h2>
//             </div>
//             <div className="w-full bg-blue-900 flex flex-col justify-center items-center mt-3 p-3 border-l-4 border-l-white rounded">
//               <h3 className="text-lg font-bold mb-1 text-white">Brain Tumor Detection</h3>
//               <p className="text-xs text-justify leading-relaxed text-white">
//                 Powered by VGG16 deep learning model for brain MRI analysis.
//                 Predicts possible brain tumor from uploaded MRI images.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-10">

//           {/* Mobile logo*/}
//           <div className="flex md:hidden items-center gap-2 mb-6">
//             <FaBrain className="text-2xl text-blue-950" />
//             <h3 className="text-lg font-bold text-blue-950">Brain Tumor Detection</h3>
//           </div>

//           <h2 className="text-center text-blue-950 text-3xl md:text-4xl font-bold mb-8">
//             Login Form
//           </h2>

//           <form className="flex flex-col w-full max-w-sm" onSubmit={submitHandler}>

//             {error && (
//               <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
//                 {error}
//               </div>
//             )}

//             <div className="flex flex-col mb-4">
//               <label className="mb-1 text-sm font-semibold text-gray-700">Email</label>
//               <input
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 type="email"
//                 placeholder="Enter your email"
//                 required
//                 className="p-3 rounded outline-0 w-full bg-gray-200 hover:ring-2 hover:ring-blue-800 hover:bg-gray-100"
//               />
//             </div>

//             <div className="flex flex-col mb-2">
//               <label className="mb-1 text-sm font-semibold text-gray-700">Password</label>
//               <div className="relative">
//                 <input
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   type={showPass ? "text" : "password"}
//                   placeholder="Enter your password"
//                   required
//                   className="p-3 rounded outline-0 w-full bg-gray-200 hover:ring-2 hover:ring-blue-800 hover:bg-gray-100 pr-10"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPass(!showPass)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-800"
//                 >
//                   {showPass ? <FaEye /> : <FaEyeSlash />}
//                 </button>
//               </div>
//             </div>
           

//             <button
//               className="p-3 mt-5 rounded-lg shadow w-full bg-blue-950 text-white  font-semibold  active:scale-95 disabled:opacity-60 transition duration-300 hover:bg-blue-900 shadow-blue-900 hover:shadow-xl hover:-translate-y-0.5 hover:shadow-blue-500/40"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "LogIn"}
//             </button>

//             <Link
//               to="/change-password"
//               className="mt-4 text-center text-blue-900 text-sm hover:underline"
//             >
//               Change Password?
//             </Link>

//           </form>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default LogIn;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import img2 from "../Image/img1.png";
import { FaRobot, FaBrain, FaEye, FaEyeSlash } from "react-icons/fa";

const API = "/api";

function LogIn() {
  const [mode, setMode]         = useState("login"); // "login" | "signup"
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setConfirmPass("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "signup") {
      if (password !== confirmPass) {
        setError("Passwords do not match!");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters!");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${API}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.detail || "Signup failed!");
          return;
        }
        setSuccess("Account created! You can now log in.");
        switchMode("login");
      } catch {
        setError("Cannot connect to server. Please make sure the backend is running!");
      } finally {
        setLoading(false);
      }
      return;
    }

    // LOGIN
    setLoading(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Login failed!");
        return;
      }
      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.removeItem("disclaimer_accepted");
      navigate("/disclaimer-gate");
    } catch {
      setError("Cannot connect to server. Please make sure the backend is running!");
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl flex flex-col md:flex-row rounded-xl shadow-xl overflow-hidden">

        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 flex-col">
          <div className="flex-1">
            <img src={img2} alt="Example MRI" className="object-contain w-full h-64 md:h-80 lg:h-96 float" />
          </div>
          <div className="bg-blue-800 flex flex-col p-4 items-center">
            <div className="flex justify-center items-center gap-3">
              <FaRobot className="text-3xl text-white" />
              <h2 className="text-xl font-bold text-white">AI Model</h2>
            </div>
            <div className="w-full bg-blue-900 flex flex-col justify-center items-center mt-3 p-3 border-l-4 border-l-white rounded">
              <h3 className="text-lg font-bold mb-1 text-white">Brain Tumor Detection</h3>
              <p className="text-xs text-justify leading-relaxed text-white">
                Powered by VGG16 deep learning model for brain MRI analysis.
                Predicts possible brain tumor from uploaded MRI images.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-10">

          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 mb-6">
            <FaBrain className="text-2xl text-blue-950" />
            <h3 className="text-lg font-bold text-blue-950">Brain Tumor Detection</h3>
          </div>

          {/* Tab toggle */}
          <div className="flex w-full max-w-sm mb-6 rounded-lg overflow-hidden border border-blue-950">
            <button
              onClick={() => switchMode("login")}
              className={`flex-1 py-2 text-sm font-semibold transition ${mode === "login" ? "bg-blue-950 text-white" : "bg-white text-blue-950 hover:bg-blue-50"}`}
            >
              Login
            </button>
            <button
              onClick={() => switchMode("signup")}
              className={`flex-1 py-2 text-sm font-semibold transition ${mode === "signup" ? "bg-blue-950 text-white" : "bg-white text-blue-950 hover:bg-blue-50"}`}
            >
              Sign Up
            </button>
          </div>

          <h2 className="text-center text-blue-950 text-2xl md:text-3xl font-bold mb-6">
            {mode === "login" ? "Login Form" : "Create Account"}
          </h2>

          <form className="flex flex-col w-full max-w-sm" onSubmit={submitHandler}>

            {error && (
              <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-3 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm text-center">
                {success}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col mb-4">
              <label className="mb-1 text-sm font-semibold text-gray-700">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                required
                className="p-3 rounded outline-0 w-full bg-gray-200 hover:ring-2 hover:ring-blue-800 hover:bg-gray-100"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col mb-2">
              <label className="mb-1 text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="p-3 rounded outline-0 w-full bg-gray-200 hover:ring-2 hover:ring-blue-800 hover:bg-gray-100 pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-800">
                  {showPass ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            {/* Confirm Password — only signup */}
            {mode === "signup" && (
              <div className="flex flex-col mb-2 mt-2">
                <label className="mb-1 text-sm font-semibold text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    required
                    className="p-3 rounded outline-0 w-full bg-gray-200 hover:ring-2 hover:ring-blue-800 hover:bg-gray-100 pr-10"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-800">
                    {showConfirm ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
            )}

            <button
              className="p-3 mt-5 rounded-lg shadow w-full bg-blue-950 text-white font-semibold active:scale-95 disabled:opacity-60 transition duration-300 hover:bg-blue-900 hover:shadow-xl hover:-translate-y-0.5 hover:shadow-blue-500/40"
              type="submit"
              disabled={loading}
            >
              {loading ? (mode === "login" ? "Logging in..." : "Creating account...") : (mode === "login" ? "Login" : "Sign Up")}
            </button>

            {mode === "login" && (
              <Link to="/change-password" className="mt-4 text-center text-blue-900 text-sm hover:underline">
                Change Password?
              </Link>
            )}

          </form>
        </div>

      </div>
    </div>
  );
}

export default LogIn;