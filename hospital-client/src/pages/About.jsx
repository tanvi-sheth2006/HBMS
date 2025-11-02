import {
  HeartPulse,
  Users,
  Stethoscope,
  Pill,
  Building2,
  Code2,
  Phone,
  Mail,
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-teal-600" />,
      title: "Patient Management",
      desc: "Easily register, update, and track patient details to streamline hospital workflow.",
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-teal-600" />,
      title: "Doctor Coordination",
      desc: "Assign doctors to treatments and appointments with efficient scheduling tools.",
    },
    {
      icon: <Pill className="w-8 h-8 text-teal-600" />,
      title: "Pharmacy Integration",
      desc: "Keep medicine inventory updated and track prescriptions across departments.",
    },
    {
      icon: <Building2 className="w-8 h-8 text-teal-600" />,
      title: "Room & Facility Tracking",
      desc: "Monitor room availability, occupancy, and hospital resource allocation in real time.",
    },
  ];

  const team = [
    {
      name: "Dr. Tanvi Sheth",
      role: "Dermatologist",
      quote: "Caring for skin health with expertise and compassion.",
    },
    {
      name: "Dr. Krish Shaw",
      role: "Cardiologist",
      quote: "Dedicated to heart health and patient well-being.",
    },
    {
      name: "Dr. Meet Shah",
      role: "Orthopedic",
      quote: "Restoring mobility and improving quality of life.",
    },
    {
      name: "Dr. Kapil Patil",
      role: "Neurologist",
      quote: "Advancing brain health through innovative care.",
    },
  ];

  const contacts = [
    {
      role: "Executive Office",
      number: "+91 98765 43210",
    },
    {
      role: "Reception Desk",
      number: "+91 91234 56789",
    },
    {
      role: "Emergency Contact",
      number: "+91 99999 11111",
    },
  ];

  const emails = [
    "info@citycarehospital.com",
    "appointments@citycarehospital.com",
    "support@citycarehospital.com",
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <HeartPulse className="w-12 h-12 text-teal-600 animate-pulse" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
          About <span className="text-teal-600">CityCare</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          CityCare is a mini Hospital Management System frontend built to simplify hospital workflows.
          It helps manage patients, doctors, pharmacy, and appointments efficiently. The system connects
          to a MySQL database through an API to enable secure and reliable CRUD operations.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-16">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Team Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Code2 className="w-10 h-10 text-teal-600" />
        </div>
        <h2 className="text-3xl font-bold mb-3">Meet Our Team</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We’re a passionate team of developers and designers dedicated to building efficient digital healthcare solutions.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {team.map((member, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:scale-105 transition-transform"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
              {member.name.charAt(0)}
            </div>
            <h3 className="text-lg font-semibold mt-4">{member.name}</h3>
            <p className="text-teal-600 text-sm">{member.role}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm italic mt-2">
              “{member.quote}”
            </p>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Phone className="w-10 h-10 text-teal-600" />
        </div>
        <h2 className="text-3xl font-bold mb-3">Contact & Helpline</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Reach out to us anytime for appointments, assistance, or emergencies.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
          {contacts.map((c, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-teal-600 font-semibold text-lg mb-1">{c.role}</h3>
              <p className="text-gray-700 dark:text-gray-300">{c.number}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          <Mail className="w-6 h-6 text-teal-600" />
          {emails.map((email, index) => (
            <p key={index} className="text-gray-700 dark:text-gray-300 text-sm">
              {email}
            </p>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-6">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          🚀 Developed using <strong>React</strong>, <strong>Node.js</strong>, and <strong>MySQL</strong>.
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
          © {new Date().getFullYear()} CityCare Hospital Management System
        </p>
      </div>
    </div>
  );
}
