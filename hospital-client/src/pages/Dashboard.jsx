import { useEffect, useState } from "react";

export default function Dashboard(){
  const [stats, setStats] = useState({patients:0, doctors:0, appointments:0});
  useEffect(()=>{ load(); },[]);
  const load = async () => {
    try {
      const resP = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/patients`);
      const patients = await resP.json();
      const resD = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/doctors`);
      const doctors = await resD.json();
      const resA = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/appointments`);
      const appts = await resA.json();
      setStats({ patients:patients.length, doctors: doctors.length, appointments: appts.length });
    } catch (e) {}
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-teal-600">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <div className="text-sm text-gray-500">Patients</div>
          <div className="text-2xl font-semibold">{stats.patients}</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <div className="text-sm text-gray-500">Doctors</div>
          <div className="text-2xl font-semibold">{stats.doctors}</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <div className="text-sm text-gray-500">Appointments</div>
          <div className="text-2xl font-semibold">{stats.appointments}</div>
        </div>
      </div>
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">More admin features can go here (manage users, medicines, reports).</div>
      </div>
    </div>
  );
}
