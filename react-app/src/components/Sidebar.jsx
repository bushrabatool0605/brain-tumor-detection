
import { FaBars, FaHome, FaInfoCircle, FaFileAlt, FaKey, FaBrain, FaFileMedical, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { to: "/dashboard",                icon: <FaHome />,        label: "Dashboard" },
  { to: "/analyze-MRI",              icon: <FaBrain />,       label: "Analyze MRI" },
  { to: "/user-manual",              icon: <FaInfoCircle />,  label: "User Manual" },
  { to: "/disclaimer",               icon: <FaFileAlt />,     label: "Disclaimer" },
  { to: "/settings/change-password", icon: <FaKey />,         label: "Change Password" },
  { to: "/history",                  icon: <FaFileMedical />, label: "History" },
];

function Tooltip({ label }) {
  return (
    <div className="
      absolute left-full top-1/2 -translate-y-1/2 ml-4
      bg-blue-950 text-white  text-xs font-medium
      px-2.5 py-1.5 rounded-md whitespace-nowrap
      opacity-0 group-hover:opacity-100
      transition-opacity duration-200
      pointer-events-none  shadow-lg 
    ">
      {label}
      <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900" />
    </div>
  );
}

function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("disclaimer_accepted");
    navigate("/login");
  };

  return (
    <>
      {/* ══════════════════════════════════════
          MOBILE — Top Header (hidden on md+)
      ══════════════════════════════════════ */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-blue-950 text-white flex items-center justify-between px-4 py-3 shadow-lg ">
  <div className="flex items-center gap-2">
  <div className="bg-white p-1.5 rounded-lg">
    <FaBrain className="text-2xl text-blue-950" />
  </div>
  <span className="font-bold text-base tracking-wide mx-3">MRI Analyzer</span>
</div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded hover:bg-blue-800 transition cursor-pointer"
        >
          {mobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed top-12 left-0 right-0 z-40 bg-blue-950 text-white shadow-xl flex flex-col px-3 py-3 gap-1">
          {navItems.map(({ to, icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors
                  ${isActive ? "bg-white text-blue-950" : "hover:bg-blue-800"}`}
              > 
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white hover:text-blue-950 transition-colors cursor-pointer mt-1"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      )}

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════
          DESKTOP — Left Sidebar (hidden on mobile)
      ══════════════════════════════════════ */}
      <div
        className={`
          hidden md:flex
           sticky top-0 h-screen z-50
          bg-blue-950 text-white
          flex-col py-5 px-2
          overflow-visible
          transition-all duration-300 ease-in-out
          ${open ? "w-52" : "w-16"}
        `}
      >
        {/* Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="hover:bg-gray-200 hover:text-blue-950 p-2 rounded w-fit mb-5 cursor-pointer"
        >
          <FaBars className="text-xl" />
        </button>

        {/* Nav Items */}
        <ul className="flex flex-col gap-3 flex-1">
          {navItems.map(({ to, icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <li key={to} className="relative group">
                <Link
                  to={to}
                  className={`
                    flex items-center gap-3 px-2 py-2.5 rounded
                    transition-colors duration-150
                    ${isActive ? "bg-white text-blue-950" : "hover:bg-gray-200 hover:text-blue-950"}
                  `}
                >
                  <span className="text-lg ">{icon}</span>
                  {open && (
                    <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                      {label}
                    </span>
                  )}
                </Link>
                {!open && <Tooltip label={label} />}
              </li>
            );
          })}
        </ul>

        {/* Logout */}
        <div className="relative group">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-2 py-2.5 rounded hover:bg-white hover:text-blue-950 transition-colors cursor-pointer"
          >
            <span className="text-lg "><FaSignOutAlt /></span>
            {open && <span className="text-sm font-medium whitespace-nowrap">Logout</span>}
          </button>
          {!open && <Tooltip label="Logout" />}
        </div>
      </div>
    </>
  );
}

export default Sidebar;