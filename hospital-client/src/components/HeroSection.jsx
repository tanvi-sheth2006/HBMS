import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 flex flex-col items-center text-center">
        
        {/* MAIN CONTENT */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-400"
        >
          Smarter Health,<br />Better Lives.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed"
        >
          Experience the next generation of healthcare with CityCare — AI-powered consultations,
          online pharmacy, and 24/7 emergency support.
        </motion.p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/appointments"
            className="px-6 py-3 bg-teal-600 text-white font-medium rounded-xl shadow-lg hover:bg-teal-700 transition-all duration-200"
          >
            Get Started
          </a>
          <a
            href="/about"
            className="px-6 py-3 border border-teal-500 text-teal-600 rounded-xl hover:bg-teal-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            Learn More
          </a>
        </div>

      </div>
    </section>
  );
}
