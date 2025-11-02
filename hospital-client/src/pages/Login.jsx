import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [form, setForm] = useState({email:"", password:""});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/auth/login`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if(data.token){
      localStorage.setItem("hms_token", data.token);
      localStorage.setItem("hms_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } else {
      alert("Invalid credentials (demo: use user@demo / password)");
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Sign in</h2>
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" className="w-full border px-3 py-2 rounded mb-3" />
        <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="Password" className="w-full border px-3 py-2 rounded mb-4" />
        <button className="w-full bg-teal-600 text-white py-2 rounded">Sign in</button>
      </form>
    </div>
  );
}
