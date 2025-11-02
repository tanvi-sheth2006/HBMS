import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Set the base URL for your API.
// Change this if your server is on a different port.
const API_BASE_URL = 'http://localhost:3001';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', specialization: '', mobile: '', salary: '' });
  const [query, setQuery] = useState('');

  // --- State for Modals ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: null, name: '', specialization: '', mobile: '', salary: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/doctors`);
      if (Array.isArray(res.data)) {
        setDoctors(res.data);
      } else {
        setDoctors([]);
      }
    } catch (e) {
      console.error(e);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }

  async function addDoctor(e) {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/doctors`, form);
      setForm({ name: '', specialization: '', mobile: '', salary: '' });
      fetchDocs();
    } catch (err) {
      console.error(err);
    }
  }

  // --- Edit Doctor Functions ---
  const openEditModal = (doctor) => {
    setEditForm(doctor);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({ id: null, name: '', specialization: '', mobile: '', salary: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/doctors/${editForm.id}`, editForm);
      closeEditModal();
      fetchDocs();
    } catch (err) {
      console.error("Failed to update doctor", err);
    }
  };

  // --- Delete Doctor Functions ---
  const openDeleteModal = (doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDoctorToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/doctors/${doctorToDelete.id}`);
      closeDeleteModal();
      fetchDocs();
    } catch (err) {
      console.error("Failed to delete doctor", err);
    }
  };

  const filtered = Array.isArray(doctors) ? doctors.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    String(d.id).includes(query)
  ) : [];

  return (
    // Added dark mode classes back to main container
    <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      {/* Restored dark mode H1 styling */}
      <h1 className="text-3xl font-bold mb-6 text-teal-600 dark:text-teal-400">Doctors</h1>
      
      {/* Restored dark mode form styling */}
      <div className="mb-4">
        <form onSubmit={addDoctor} className="flex flex-wrap gap-3">
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100" />
          <input required value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="Specialization" className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100" />
          <input required value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} placeholder="Mobile" className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 w-40" />
          <input required value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="Salary" className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 w-28" />
          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Add</button>
        </form>
      </div>

      {/* Added dark mode styling to search bar */}
      <div className="mb-4 flex justify-between">
        <input placeholder="Search by name or id" value={query} onChange={e => setQuery(e.target.value)} className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 w-64" />
      </div>

      {/* Restored dark mode table container */}
      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-auto">
        <table className="min-w-full text-left">
          {/* Restored dark mode table head */}
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Specialization</th>
              <th className="p-2">Mobile</th>
              <th className="p-2">Salary</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="p-4 text-center dark:text-gray-300">Loading...</td></tr> : (
              filtered.map(d => (
                // Restored dark mode table row border
                <tr key={d.id} className="border-t dark:border-gray-700">
                  <td className="p-2">{d.id}</td>
                  <td className="p-2">{d.name}</td>
                  <td className="p-2">{d.specialization}</td>
                  <td className="p-2">{d.mobile}</td>
                  <td className="p-2">{d.salary}</td>
                  <td className="p-2">
                    <button onClick={() => openEditModal(d)} className="text-blue-600 dark:text-blue-400 mr-2">Edit</button>
                    <button onClick={() => openDeleteModal(d)} className="text-red-600 dark:text-red-400 mr-2">Delete</button>
                  </td>
                </tr>
              ))
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center dark:text-gray-300">No doctors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Edit Modal (with dark mode) --- */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          {/* Switched to Tailwind classes for modal styling */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Doctor</h3>
            <form onSubmit={handleUpdateDoctor}>
              <div style={{ marginBottom: '10px' }}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input name="name" value={editForm.name} onChange={handleEditChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialization</label>
                <input name="specialization" value={editForm.specialization} onChange={handleEditChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile</label>
                <input name="mobile" value={editForm.mobile} onChange={handleEditChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary</label>
                <input name="salary" type="number" value={editForm.salary} onChange={handleEditChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={closeEditModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal (with dark mode) --- */}
      {isDeleteModalOpen && doctorToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Confirm Deletion</h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete doctor <strong className="font-medium text-gray-900 dark:text-gray-100">{doctorToDelete.name}</strong> (ID: {doctorToDelete.id})?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500">
                Cancel
              </button>
              <button onClick={handleDeleteDoctor} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

