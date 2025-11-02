import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Set the base URL for your API.
// Change this if your server is on a different port.
const API_BASE_URL = 'http://localhost:3001';

export default function Pharmacy() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  // Renamed to 'newMedicine' for clarity
  const [newMedicine, setNewMedicine] = useState({ name: '', location: '' });
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  // --- State for Modals ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: null, name: '', location: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  async function fetchMedicines() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/pharmacy`);
      if (Array.isArray(res.data)) {
        setMedicines(res.data);
      } else {
        setMedicines([]);
      }
    } catch (e) {
      console.error(e);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }

  async function addMedicine(e) {
    e.preventDefault();
    if (!newMedicine.name || !newMedicine.location) {
        return setError('All fields are required.');
    }
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/api/pharmacy`, newMedicine);
      setNewMedicine({ name: '', location: '' });
      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  }

  // --- Edit Medicine Functions ---
  const openEditModal = (medicine) => {
    setEditForm(medicine);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({ id: null, name: '', location: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateMedicine = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/pharmacy/${editForm.id}`, editForm);
      closeEditModal();
      fetchMedicines();
    } catch (err) {
      console.error("Failed to update medicine", err);
    }
  };

  // --- Delete Medicine Functions ---
  const openDeleteModal = (medicine) => {
    setItemToDelete(medicine);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteMedicine = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/pharmacy/${itemToDelete.id}`);
      closeDeleteModal();
      fetchMedicines();
    } catch (err) {
      console.error("Failed to delete medicine", err);
    }
  };

  // Filter medicines by name or location
  const filtered = Array.isArray(medicines) ? medicines.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.location.toLowerCase().includes(query.toLowerCase()) ||
    String(m.id).includes(query)
  ) : [];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-teal-600 dark:text-teal-400">Pharmacy Inventory</h1>
      
      {/* Add New Medicine Form */}
      <div className="mb-4">
        <form onSubmit={addMedicine} className="flex flex-wrap gap-3">
          <input 
            required 
            value={newMedicine.name} 
            onChange={e => {
                setNewMedicine({ ...newMedicine, name: e.target.value });
                setError('');
            }} 
            placeholder="Medicine Name" 
            className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 flex-1" 
          />
          <input 
            required 
            value={newMedicine.location} 
            onChange={e => {
                setNewMedicine({ ...newMedicine, location: e.target.value });
                setError('');
            }} 
            placeholder="Stock Location (e.g., First Floor)" 
            className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 flex-1" 
          />
          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Add</button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex justify-between">
        <input 
          placeholder="Search by name, location, or ID" 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 w-full sm:w-64" 
        />
      </div>

      {/* Medicine List Table */}
      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-2">Medicine ID</th>
              <th className="p-2">Medicine Name</th>
              <th className="p-2">Pharmacy Location</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="p-4 text-center dark:text-gray-300">Loading...</td></tr> : (
              filtered.map(m => (
                <tr key={m.id} className="border-t dark:border-gray-700">
                  <td className="p-2">{m.id}</td>
                  <td className="p-2">{m.name}</td>
                  <td className="p-2">{m.location}</td>
                  <td className="p-2">
                    <button onClick={() => openEditModal(m)} className="text-blue-600 dark:text-blue-400 mr-2">Edit</button>
                    <button onClick={() => openDeleteModal(m)} className="text-red-600 dark:text-red-400 mr-2">Delete</button>
                  </td>
                </tr>
              ))
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={4} className="p-4 text-center dark:text-gray-300">No medicines found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Edit Modal --- */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Medicine</h3>
            <form onSubmit={handleUpdateMedicine}>
              <div style={{ marginBottom: '10px' }}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Medicine Name</label>
                <input name="name" value={editForm.name} onChange={handleEditChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Location</label>
                <input name="location" value={editForm.location} onChange={handleEditChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
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

      {/* --- Delete Confirmation Modal --- */}
      {isDeleteModalOpen && itemToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Confirm Deletion</h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete <strong className="font-medium text-gray-900 dark:text-gray-100">{itemToDelete.name}</strong> (ID: {itemToDelete.id})?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500">
                Cancel
              </button>
              <button onClick={handleDeleteMedicine} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
