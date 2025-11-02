import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

export default function Treatments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTreatment, setEditingTreatment] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState({ patient_id: '', medicine: '', date: '', type: '' })
  
  const location = useLocation()

  useEffect(() => {
    fetchTreatments()
    if (location.state?.openModal) {
      setShowModal(true)
    }
  }, [])

  function fetchTreatments() {
    setLoading(true)
    axios.get(import.meta.env.VITE_API_URL + '/api/treatments')
      .then(r => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  function handleSubmit(e) {
    e.preventDefault()
    
    if (editingTreatment) {
      axios.put(import.meta.env.VITE_API_URL + `/api/treatments/${editingTreatment.id}`, form)
        .then(() => {
          alert('Treatment updated successfully!')
          setForm({ patient_id: '', medicine: '', date: '', type: '' })
          setShowModal(false)
          setEditingTreatment(null)
          fetchTreatments()
        })
        .catch(() => alert('Error updating treatment'))
    } else {
      axios.post(import.meta.env.VITE_API_URL + '/api/treatments', form)
        .then(() => {
          alert('Treatment added successfully!')
          setForm({ patient_id: '', medicine: '', date: '', type: '' })
          setShowModal(false)
          fetchTreatments()
        })
        .catch(() => alert('Error adding treatment'))
    }
  }

  function openModal(treatment = null) {
    if (treatment) {
      setEditingTreatment(treatment)
      const dateStr = treatment.date ? new Date(treatment.date).toISOString().split('T')[0] : ''
      setForm({
        patient_id: treatment.patient_id,
        medicine: treatment.medicine,
        date: dateStr,
        type: treatment.type
      })
    } else {
      setEditingTreatment(null)
      setForm({ patient_id: '', medicine: '', date: '', type: '' })
    }
    setShowModal(true)
  }

  function deleteTreatment(id) {
    if (!confirm('Are you sure you want to delete this treatment?')) return
    
    axios.delete(import.meta.env.VITE_API_URL + `/api/treatments/${id}`)
      .then(() => {
        alert('Treatment deleted successfully!')
        fetchTreatments()
      })
      .catch(() => alert('Error deleting treatment'))
  }

  const filteredTreatments = items.filter(treatment => 
    treatment.medicine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    treatment.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(treatment.id).includes(searchQuery) ||
    String(treatment.patient_id).includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-6">
            Treatment Management
          </h1>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by medicine, type, patient ID, or treatment ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-teal-500 mb-4"
          />

          {/* Add Button */}
          <button
            onClick={() => openModal()}
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
          >
            Add New Treatment
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">Loading treatments...</p>
            </div>
          ) : filteredTreatments.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Treatment ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Patient ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Medicine</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTreatments.map((treatment) => (
                  <tr key={treatment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{treatment.id}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{treatment.patient_id}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{treatment.medicine}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      {treatment.date ? new Date(treatment.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{treatment.type}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => openModal(treatment)}
                        className="text-teal-600 hover:text-teal-700 dark:text-teal-400 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTreatment(treatment.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No treatments found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editingTreatment ? 'Edit Treatment' : 'Add New Treatment'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Patient ID *</label>
                <input
                  type="number"
                  required
                  value={form.patient_id}
                  onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"
                  placeholder="Enter patient ID"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Medicine *</label>
                <input
                  type="text"
                  required
                  value={form.medicine}
                  onChange={(e) => setForm({ ...form, medicine: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"
                  placeholder="e.g., Paracetamol, Metformin"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Type *</label>
                <input
                  type="text"
                  required
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"
                  placeholder="e.g., Diabetes, Fever"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingTreatment(null)
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                >
                  {editingTreatment ? 'Update' : 'Add'} Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
