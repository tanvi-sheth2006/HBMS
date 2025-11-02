import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.theme === "dark");
  const navigate = useNavigate();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [dark]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Patients", path: "/patients" },
    { name: "Doctors", path: "/doctors" },
    { name: "Rooms", path: "/rooms" },
    { name: "Treatments", path: "/treatments" },
    { name: "Tests", path: "/tests" },
    { name: "Pharmacy", path: "/pharmacy" },
    { name: "Appointments", path: "/appointments" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 text-gray-800 dark:text-gray-100">
        {/* Left section */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 flex items-center"
          >
            <span className="mr-2">🏥</span> CityCare
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-4 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-teal-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => navigate("/login")}
            className="hidden md:inline px-3 py-1 rounded bg-teal-600 text-white text-sm hover:bg-teal-700"
          >
            Sign in
          </button>
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden p-4 border-t bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className="block py-2 hover:text-teal-500 transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <button
            onClick={() => {
              setDark(!dark);
              setOpen(false);
            }}
            className="mt-3 w-full py-2 bg-gray-100 dark:bg-gray-700 rounded"
          >
            Toggle theme
          </button>

          <button
            onClick={() => {
              setOpen(false);
              navigate("/login");
            }}
            className="mt-2 w-full py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Sign in
          </button>
        </div>
      )}
    </nav>
  );
}
