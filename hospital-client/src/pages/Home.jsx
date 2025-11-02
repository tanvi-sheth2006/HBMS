import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import ChatbotWidget from "../components/ChatbotWidget";
import StatsCard from "../components/StatsCard";
import ServiceCard from "../components/ServiceCard";
import { Users, Stethoscope, Pill, HeartPulse, Ambulance, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <StatsCard title="Patients Treated" value="35+" />
          <StatsCard title="Doctors Available" value="20+" />
          <StatsCard title="Pharmacy Products" value="50+" />
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-10"
          >
            Our Core Services
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard icon={<Stethoscope />} title="Online Consult" desc="Connect with doctors instantly through secure video consultations." />
            <ServiceCard icon={<Ambulance />} title="Emergency Care" desc="Round-the-clock ambulance and trauma services with expert staff." />
            <ServiceCard icon={<Pill />} title="Pharmacy Delivery" desc="Order medicines and get them delivered straight to your doorstep." />
            <ServiceCard icon={<HeartPulse />} title="Wellness Programs" desc="Personalized health plans and fitness guidance from specialists." />
            <ServiceCard icon={<Users />} title="Specialist Team" desc="Access certified professionals across 10+ medical fields." />
            <ServiceCard icon={<Shield />} title="Secure Records" desc="Your health data is protected with state-of-the-art encryption." />
          </div>
        </div>
      </section>

      {/* Quick Actions Section - NEW */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-10 text-center"
          >
            Quick Access
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Book Appointment */}
            <Link
              to="/appointments"
              state={{ openModal: true }}
              className="group p-8 bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 hover:from-pink-100 hover:to-rose-200 dark:hover:from-pink-900/30 dark:hover:to-rose-900/30 rounded-xl text-center transition-all shadow-lg hover:shadow-2xl border-2 border-pink-200 dark:border-pink-800 transform hover:scale-105"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📅</div>
              <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 text-lg">Book Appointment</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Schedule with doctors</p>
            </Link>

            {/* View Doctors */}
            <Link
              to="/doctors"
              className="group p-8 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-200 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 rounded-xl text-center transition-all shadow-lg hover:shadow-2xl border-2 border-green-200 dark:border-green-800 transform hover:scale-105"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👨‍⚕️</div>
              <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 text-lg">View Doctors</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Browse specialists</p>
            </Link>

            {/* Book Room */}
            <Link
              to="/rooms"
              state={{ openModal: true }}
              className="group p-8 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 hover:from-purple-100 hover:to-indigo-200 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 rounded-xl text-center transition-all shadow-lg hover:shadow-2xl border-2 border-purple-200 dark:border-purple-800 transform hover:scale-105"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🛏️</div>
              <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 text-lg">Book Room</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Reserve hospital beds</p>
            </Link>

            {/* View Pharmacy */}
            <Link
              to="/pharmacy"
              className="group p-8 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 hover:from-orange-100 hover:to-amber-200 dark:hover:from-orange-900/30 dark:hover:to-amber-900/30 rounded-xl text-center transition-all shadow-lg hover:shadow-2xl border-2 border-orange-200 dark:border-orange-800 transform hover:scale-105"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">💊</div>
              <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 text-lg">Pharmacy</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Order medicines</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-cyan-400 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-6"
        >
          <h2 className="text-4xl font-extrabold mb-4">Your Health, Our Priority</h2>
          <p className="mb-8 text-lg opacity-90">
            CityCare brings modern healthcare closer to you — with technology, trust, and expert care.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/appointments"
              state={{ openModal: true }}
              className="px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
            >
              Book Appointment
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 border border-white rounded-lg hover:bg-white/10 transition"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      <ChatbotWidget />
    </div>
  );
}
