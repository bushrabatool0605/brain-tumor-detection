import LogIn from "./pages/LogIn"
import Sidebar from "./components/Sidebar"
import ChngPaswrd from "./pages/ChngPaswrd"
import Dashboard from "./pages/Dashboard"
import React from "react"
import { Routes, Route, Navigate } from "react-router-dom";
import UserManual from "./pages/UserManual";
import Disclaimer from "./pages/Disclaimer";
import History from "./pages/History";
import AnalyzeMRI from "./pages/AnalyzeMRI";
import { useState } from "react";

// Protected Route — if not logged in, redirect to login
function ProtectedRoute({ children }) {
  const user = sessionStorage.getItem("user");
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Disclaimer Gate — after login, must see disclaimer first
function DisclaimerRoute({ children }) {
  const user     = sessionStorage.getItem("user");
  const accepted = sessionStorage.getItem("disclaimer_accepted");
  if (!user)     return <Navigate to="/login" replace />;
  if (!accepted) return <Navigate to="/disclaimer-gate" replace />;
  return children;
}

// Layout with Sidebar — sidebar + content side by side, no overlap
function WithSidebar({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar open={open} setOpen={setOpen} />
      {/* Content takes remaining width */}
       {/* pt-12 — mobile header ki height ke barabar top padding */}
      <div className="flex-1 min-w-0 overflow-auto pt-12 md:pt-0">
        {children}
      </div>
    </div>
  );
}


function App() {
  return (
    <Routes>

      {/* Public Routes — no sidebar */}
      <Route path="/login"           element={<LogIn />} />
      <Route path="/change-password" element={<ChngPaswrd />} />

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Disclaimer Gate — after login, before dashboard, no sidebar */}
      <Route
        path="/disclaimer-gate"
        element={
          <ProtectedRoute>
            <Disclaimer isGate={true} />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes — all have sidebar */}
      <Route path="/dashboard"
        element={<DisclaimerRoute><WithSidebar><Dashboard /></WithSidebar></DisclaimerRoute>}
      />
      <Route path="/disclaimer"
        element={<ProtectedRoute><WithSidebar><Disclaimer isGate={false} /></WithSidebar></ProtectedRoute>}
      />
      <Route path="/history"
        element={<DisclaimerRoute><WithSidebar><History /></WithSidebar></DisclaimerRoute>}
      />
      <Route path="/settings/change-password"
        element={<DisclaimerRoute><WithSidebar><ChngPaswrd /></WithSidebar></DisclaimerRoute>}
      />
      <Route path="/user-manual"
        element={<DisclaimerRoute><WithSidebar><UserManual /></WithSidebar></DisclaimerRoute>}
      />
      <Route path="/analyze-MRI"
        element={<DisclaimerRoute><WithSidebar><AnalyzeMRI /></WithSidebar></DisclaimerRoute>}
      />

    </Routes>
  );
}

export default App;
