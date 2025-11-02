import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([]) // Still needed for modal dropdown
  const [doctors, setDoctors] = useState([])   // Still needed for modal dropdown
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState({
    patientid: '',
    doctorid: '',
    appointmentdate: '',
    reason: ''
  })

  const location = useLocation()

  useEffect(() => {
    fetchData()
    if (location.state?.openModal) {
      setShowModal(true)
    }
  }, [])

  // This function is correct. It fetches appointments (with joined data)
  // AND fetches patients/doctors for the modal's <select> options.
  async function fetchData() {
    setLoading(true)
    try {
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        axios.get('http://localhost:3001/api/appointments'),
        axios.get('http://localhost:3001/api/patients'),
        axios.get('http://localhost:3001/api/doctors')
      ])
      setAppointments(appointmentsRes.data)
      setPatients(patientsRes.data)
      setDoctors(doctorsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (editingAppointment) {
        // Use editingAppointment.id (which your backend query provides as 'a.id')
        await axios.put(`http://localhost:3001/api/appointments/${editingAppointment.id}`, form)
        alert('Appointment updated successfully!')
      } else {
        await axios.post('http://localhost:3001/api/appointments', form)
        alert('Appointment booked successfully!')
      }
      setForm({ patientid: '', doctorid: '', appointmentdate: '', reason: '' })
      setShowModal(false)
      setEditingAppointment(null)
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Error booking appointment')
    }
  }

  function deleteAppointment(id) {
    if (!confirm('Cancel this appointment?')) return
    axios.delete(`http://localhost:3001/api/appointments/${id}`)
      .then(() => {
        fetchData()
        alert('Appointment cancelled successfully!')
      })
      .catch(() => alert('Error cancelling appointment'))
  }

  // This function is still correct. It uses the IDs provided
  // by the appointment object to pre-fill the form.
  function openModal(appointment = null) {
    if (appointment) {
      setEditingAppointment(appointment)
      const dateStr = new Date(appointment.appointmentdate).toISOString().slice(0, 16)
      setForm({
        patientid: appointment.patientid,
        doctorid: appointment.doctorid,
        appointmentdate: dateStr,
        reason: appointment.reason || ''
      })
    } else {
      setEditingAppointment(null)
      setForm({ patientid: '', doctorid: '', appointmentdate: '', reason: '' })
    }
    setShowModal(true)
  }

  // ✅ 1. & 2. REMOVED getPatientName and getDoctorName functions
  // They are no longer needed.

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  // ✅ 3. FIXED: Search filter now uses the direct properties from the JOIN
  const filteredAppointments = appointments.filter(apt => 
    apt.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(apt.id).includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-6">
            Appointment Management
          </h1>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by patient, doctor, or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500 mb-4"
          />

          {/* Add Button */}
          <button
            onClick={() => openModal()}
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
          >
            Add New Appointment
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Appointment ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Patient Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Doctor Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{apt.id}</td>
                    {/* ✅ 4. FIXED: Display data directly from apt.patient_name */}
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{apt.patient_name}</td>
                    {/* ✅ 4. FIXED: Display data directly from apt.doctor_name */}
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{apt.doctor_name}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{formatDate(apt.appointmentdate)}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => openModal(apt)}
                        className="text-teal-600 hover:text-teal-700 dark:text-teal-400 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAppointment(apt.id)}
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
              <p className="text-gray-500 dark:text-gray-400 text-lg">No appointments scheduled</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal (This section is unchanged and correct) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Patient *
                </label>
                <select
                  required
                  value={form.patientid}
                  onChange={(e) => setForm({ ...form, patientid: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Age: {p.age})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Doctor *
                </label>
                <select
                  required
                  value={form.doctorid}
                  onChange={(e) => setForm({ ...form, doctorid: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.name} - {d.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.appointmentdate}
                  onChange={(e) => setForm({ ...form, appointmentdate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"
                  placeholder="e.g., Follow-up consultation"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingAppointment(null)
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                >
                  {editingAppointment ? 'Update' : 'Book'} Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}