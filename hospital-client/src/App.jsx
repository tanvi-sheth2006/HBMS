import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ✅ Import all your pages
import Home from "./pages/Home";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Rooms from "./pages/Rooms";
import Pharmacy from "./pages/Pharmacy";
import Treatments from "./pages/Treatments";
import Tests from "./pages/Tests";
import About from "./pages/About";
import Appointments from "./pages/Appointments";  // ✅ Already imported
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Routes>
          {/* ✅ Core Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/appointments" element={<Appointments />} />  {/* ✅ Appointments Route */}

          {/* ✅ Info + Auth */}
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<Dashboard />} />

          {/* ✅ 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="text-center py-20 text-xl">
                <h1 className="font-bold text-3xl mb-4">404 - Page Not Found</h1>
                <p className="opacity-80">The page you're looking for doesn't exist.</p>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
