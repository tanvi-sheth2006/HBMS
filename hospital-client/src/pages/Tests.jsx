import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

// This component is now fixed to work with your server's JOIN.
// It also has dark mode classes, ready for your global toggle.

export default function Tests() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTest, setEditingTest] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState({ patient_id: '', test_name: '', cost: '', report: '' })
  
  const location = useLocation()

  useEffect(() => {
    fetchTests()
    if (location.state?.openModal) {
      setShowModal(true)
    }
  }, [])

  function fetchTests() {
    setLoading(true)
    axios.get(import.meta.env.VITE_API_URL + '/api/tests')
      .then(r => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  function handleSubmit(e) {
    e.preventDefault()
    
    if (editingTest) {
      axios.put(import.meta.env.VITE_API_URL + `/api/tests/${editingTest.id}`, form)
        .then(() => {
          alert('Test updated successfully!')
          setForm({ patient_id: '', test_name: '', cost: '', report: '' })
          setShowModal(false)
          setEditingTest(null)
          fetchTests()
        })
        .catch(() => alert('Error updating test'))
    } else {
      axios.post(import.meta.env.VITE_API_URL + '/api/tests', form)
        .then(() => {
          alert('Test scheduled successfully!')
          setForm({ patient_id: '', test_name: '', cost: '', report: '' })
          setShowModal(false)
          fetchTests()
        })
        .catch(() => alert('Error scheduling test'))
    }
  }

  function openModal(test = null) {
    if (test) {
      setEditingTest(test)
      setForm({
        // We still use patient_id for the form, which your JOIN query provides
        patient_id: test.patient_id, 
        test_name: test.test_name,
        cost: test.cost,
        report: test.report || ''
      })
    } else {
      setEditingTest(null)
      setForm({ patient_id: '', test_name: '', cost: '', report: '' })
    }
    setShowModal(true)
  }

  function deleteTest(id) {
    if (!confirm('Are you sure you want to delete this test?')) return
    
    axios.delete(import.meta.env.VITE_API_URL + `/api/tests/${id}`)
      .then(() => {
        alert('Test deleted successfully!')
        fetchTests()
      })
      .catch(() => alert('Error deleting test'))
  }

  // ✅ 1. FIXED: Added 'patient_name' to the search filter
  const filteredTests = items.filter(test => 
    test.test_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) || // <-- This line is new
    String(test.id).includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-6">
            Test Management
          </h1>

          {/* Search Bar */}
          <input
            type="text"
            // ✅ 2. FIXED: Updated placeholder text
            placeholder="Search by test name, patient name, or test ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-teal-500 mb-4"
          />

          {/* Add Button */}
          <button
            onClick={() => openModal()}
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
          >
            Add New Test
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">Loading tests...</p>
            </div>
          ) : filteredTests.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Test ID</th>
                  {/* ✅ 3. FIXED: Changed "Patient ID" to "Patient Name" */}
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Patient Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Test Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Cost</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Report</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{test.id}</td>
                    {/* ✅ 3. FIXED: Changed 'test.patient_id' to 'test.patient_name' */}
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{test.patient_name}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{test.test_name}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">₹{test.cost}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{test.report || 'Pending'}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => openModal(test)}
                        className="text-teal-600 hover:text-teal-700 dark:text-teal-400 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTest(test.id)}
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
              <p className="text-gray-500 dark:text-gray-400 text-lg">No tests scheduled</p>
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
                {editingTest ? 'Edit Test' : 'Schedule New Test'}
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
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Test Name *</label>
                <input
                  type="text"
                  required
                  value={form.test_name}
                  onChange={(e) => setForm({ ...form, test_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"
                  placeholder="e.g., Blood Test, X-Ray"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Cost *</label>
                <input
                  type="number"
                  required
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"
                  placeholder="Enter cost in ₹"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Report (Optional)</label>
                <textarea
                  value={form.report}
                  onChange={(e) => setForm({ ...form, report: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"
                  placeholder="Enter test results"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingTest(null)
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                >
                  {editingTest ? 'Update' : 'Schedule'} Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}