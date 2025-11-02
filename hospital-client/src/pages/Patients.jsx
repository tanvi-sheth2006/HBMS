import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', age: '', mobile: '' });
  const [query, setQuery] = useState('');

  // --- State for Modals ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: null, name: '', age: '', mobile: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  
  // ✅ NEW: State for Delete Log Modal
  const [showLogModal, setShowLogModal] = useState(false);
  const [deleteLogs, setDeleteLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/patients`);
      if (Array.isArray(res.data)) {
        setPatients(res.data);
      } else {
        setPatients([]);
      }
    } catch (e) {
      console.error(e);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  async function addPatient(e) {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/patients`, form);
      setForm({ name: '', age: '', mobile: '' });
      fetchPatients();
      alert('Patient added successfully!');
    } catch (err) {
      console.error(err);
      alert('Error adding patient');
    }
  }

  // --- Edit Patient Functions ---
  const openEditModal = (patient) => {
    setEditForm(patient);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({ id: null, name: '', age: '', mobile: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/patients/${editForm.id}`, editForm);
      closeEditModal();
      fetchPatients();
      alert('Patient updated successfully!');
    } catch (err) {
      console.error("Failed to update patient", err);
      alert('Error updating patient');
    }
  };

  // --- Delete Patient Functions ---
  const openDeleteModal = (patient) => {
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setPatientToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/patients/${patientToDelete.id}`);
      closeDeleteModal();
      fetchPatients();
      alert('Patient deleted successfully! Check delete history to see the audit log.');
    } catch (err) {
      console.error("Failed to delete patient", err);
      alert('Error deleting patient');
    }
  };

  // ✅ NEW: View Delete History Function (TRIGGER Demo)
  async function viewDeleteLogs() {
    setLoadingLogs(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/patient-delete-logs`);
      setDeleteLogs(res.data);
      setShowLogModal(true);
    } catch (error) {
      console.error('Error fetching logs:', error);
      alert('Error loading delete history');
    } finally {
      setLoadingLogs(false);
    }
  }

  const filtered = Array.isArray(patients) ? patients.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    String(p.id).includes(query)
  ) : [];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-teal-600 dark:text-teal-400">Patients Management</h1>
      
      {/* Add Patient Form */}
      <div className="mb-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">Add New Patient</h2>
        <form onSubmit={addPatient} className="flex flex-wrap gap-3">
          <input 
            required 
            value={form.name} 
            onChange={e => setForm({ ...form, name: e.target.value })} 
            placeholder="Name" 
            className="p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 flex-1 min-w-[200px]" 
          />
          <input 
            required 
            type="number"
            value={form.age} 
            onChange={e => setForm({ ...form, age: e.target.value })} 
            placeholder="Age" 
            className="p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 w-24" 
          />
          <input 
            required 
            value={form.mobile} 
            onChange={e => setForm({ ...form, mobile: e.target.value })} 
            placeholder="Mobile" 
            className="p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 w-40" 
          />
          <button className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 font-semibold">
            Add Patient
          </button>
        </form>
      </div>

      {/* Search Bar and View Delete History Button */}
      <div className="mb-4 flex flex-wrap justify-between gap-3">
        <input 
          placeholder="Search by name or ID" 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          className="p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 w-64" 
        />
        
        {/* ✅ NEW: Button to View Delete History */}
        <button
          onClick={viewDeleteLogs}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition shadow-md flex items-center gap-2"
        >
          <span>📜</span>
          <span>View Delete History </span>
        </button>
      </div>

      {/* Patients Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 font-semibold">ID</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Age</th>
              <th className="p-3 font-semibold">Mobile</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center dark:text-gray-300">Loading...</td></tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.age}</td>
                  <td className="p-3">{p.mobile}</td>
                  <td className="p-3 space-x-2">
                    <button 
                      onClick={() => openEditModal(p)} 
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal(p)} 
                      className="text-red-600 dark:text-red-400 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center dark:text-gray-300">No patients found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Patient</h3>
            <form onSubmit={handleUpdatePatient}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input 
                  name="name" 
                  value={editForm.name} 
                  onChange={handleEditChange} 
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
                <input 
                  name="age" 
                  type="number" 
                  value={editForm.age} 
                  onChange={handleEditChange} 
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile</label>
                <input 
                  name="mobile" 
                  value={editForm.mobile} 
                  onChange={handleEditChange} 
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
                />
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button 
                  type="button" 
                  onClick={closeEditModal} 
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && patientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Confirm Deletion</h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete patient <strong className="font-semibold text-gray-900 dark:text-gray-100">{patientToDelete.name}</strong> (ID: {patientToDelete.id})?
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-3 rounded mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ This action will trigger the database to log this deletion automatically.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={closeDeleteModal} 
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeletePatient} 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW: Delete Audit Log Modal (TRIGGER DEMO) */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-5xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-purple-600">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>📜</span>
                <span>Patient Delete Audit Log </span>
              </h2>
              <p className="text-purple-100 mt-1">
                Automatically logged by database TRIGGER when patients are deleted
              </p>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {loadingLogs ? (
                <p className="text-center py-8 text-gray-600 dark:text-gray-400">Loading logs...</p>
              ) : deleteLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold border dark:border-gray-600">Log ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border dark:border-gray-600">Patient ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border dark:border-gray-600">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border dark:border-gray-600">Age</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border dark:border-gray-600">Mobile</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border dark:border-gray-600">Deleted At</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border dark:border-gray-600">Deleted By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {deleteLogs.map((log) => (
                        <tr key={log.log_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-3 border dark:border-gray-600">{log.log_id}</td>
                          <td className="px-4 py-3 border dark:border-gray-600">{log.deleted_patient_id}</td>
                          <td className="px-4 py-3 border dark:border-gray-600 font-medium">{log.deleted_patient_name}</td>
                          <td className="px-4 py-3 border dark:border-gray-600">{log.deleted_patient_age}</td>
                          <td className="px-4 py-3 border dark:border-gray-600">{log.deleted_patient_mobile}</td>
                          <td className="px-4 py-3 border dark:border-gray-600 text-sm">
                            {new Date(log.deleted_at).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 border dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400">
                            {log.deleted_by}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">No deleted patients yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Delete a patient to see the TRIGGER in action!
                  </p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Total Records:</span> {deleteLogs.length}
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
