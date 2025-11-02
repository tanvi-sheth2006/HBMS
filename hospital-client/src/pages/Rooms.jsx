import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBookModal, setShowBookModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    patientid: '',
    duration: 1
  })

  const location = useLocation()

  useEffect(() => {
    fetchData()
    if (location.state?.openModal) {
      setShowBookModal(true)
    }
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [roomsRes, patientsRes] = await Promise.all([
        axios.get('http://localhost:3001/api/rooms'),
        axios.get('http://localhost:3001/api/patients')
      ])
      setRooms(roomsRes.data)
      setPatients(patientsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  function openBookingModal(room) {
    if (room.Availability <= 0) {
      alert('This room is fully occupied!')
      return
    }
    setSelectedRoom(room)
    setShowBookModal(true)
  }

  async function handleBookRoom(e) {
    e.preventDefault()
    try {
      const newAvailability = selectedRoom.Availability - 1
      
      await axios.put(`http://localhost:3001/api/rooms/${selectedRoom.Room_no}`, {
        Availability: newAvailability
      })
      
      alert(`Room ${selectedRoom.Room_no} booked successfully for Patient #${bookingForm.patientid}!`)
      setShowBookModal(false)
      setBookingForm({ patientid: '', duration: 1 })
      setSelectedRoom(null)
      fetchData()
    } catch (error) {
      console.error('Error booking room:', error)
      alert('Error booking room. Please try again.')
    }
  }

  const availableCount = rooms.filter(r => r.Availability > 0).length
  const occupiedCount = rooms.filter(r => r.Availability === 0).length

  return (
    // 💡 Added dark mode background
    <div className="space-y-6 dark:bg-gray-900 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-4xl font-bold flex items-center mb-2">
          <span className="text-5xl mr-3">🛏</span>
          Room Management
        </h1>
        <p className="text-purple-100">Book and monitor room availability</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 💡 Added dark mode styles */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 dark:bg-gray-800 dark:border-blue-700">
          <p className="text-gray-600 text-sm font-semibold dark:text-gray-400">Total Rooms</p>
          <p className="text-4xl font-bold text-gray-800 mt-2 dark:text-white">{rooms.length}</p>
        </div>
        {/* 💡 Added dark mode styles */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 dark:bg-gray-800 dark:border-green-700">
          <p className="text-gray-600 text-sm font-semibold dark:text-gray-400">Available Rooms</p>
          <p className="text-4xl font-bold text-green-600 mt-2 dark:text-green-400">{availableCount}</p>
        </div>
        {/* 💡 Added dark mode styles */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 dark:bg-gray-800 dark:border-red-700">
          <p className="text-gray-600 text-sm font-semibold dark:text-gray-400">Fully Occupied</p>
          <p className="text-4xl font-bold text-red-600 mt-2 dark:text-red-400">{occupiedCount}</p>
        </div>
      </div>

      {/* Rooms Grid */}
      {/* 💡 Added dark mode styles */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Available Rooms</h2>
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
            {/* 💡 Added dark mode styles */}
            <p className="mt-4 text-gray-600 text-lg font-medium dark:text-gray-400">Loading rooms...</p>
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <div
                key={room.Room_no}
                // 💡 Added dark mode styles for both conditions
                className={`p-6 rounded-xl shadow-md transition-all border-2 ${
                  room.Availability > 0
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 hover:shadow-lg dark:from-green-900 dark:to-green-800 dark:border-green-700'
                    : 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 dark:from-red-900 dark:to-red-800 dark:border-red-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">
                    {room.Availability > 0 ? '🛏' : '🔒'}
                  </div>
                  {/* 💡 Added dark mode text colors */}
                  <p className="font-bold text-2xl text-gray-800 dark:text-white">Room {room.Room_no}</p>
                  <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">{room.Room_type}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Capacity: {room.Capacity}
                    </p>
                    {/* 💡 Added dark mode text colors for both conditions */}
                    <p className={`text-sm font-bold ${room.Availability > 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      Available: {room.Availability}
                    </p>
                  </div>
                  {room.Availability > 0 ? (
                    <button
                      onClick={() => openBookingModal(room)}
                      className="mt-4 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md"
                    >
                      📅 Book Room
                    </button>
                  ) : (
                    <button
                      disabled
                      // 💡 Added dark mode disabled style
                      className="mt-4 w-full bg-gray-400 text-white py-2 rounded-lg font-bold cursor-not-allowed dark:bg-gray-600"
                    >
                      🔒 Fully Booked
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center text-gray-400">
            <span className="text-8xl block mb-4">🛏</span>
            <p className="text-2xl font-semibold">No rooms available</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* 💡 Added dark mode modal background */}
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl dark:bg-gray-700">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-3xl font-bold">🛏 Book Room {selectedRoom.Room_no}</h2>
              <p className="text-purple-100 mt-1">{selectedRoom.Room_type}</p>
            </div>
            <form onSubmit={handleBookRoom} className="p-6 space-y-4">
              {/* 💡 Added dark mode styles */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 dark:bg-purple-900 dark:border-purple-600">
                <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-bold">Room Number:</span> {selectedRoom.Room_no}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-bold">Type:</span> {selectedRoom.Room_type}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-bold">Available Beds:</span> {selectedRoom.Availability} / {selectedRoom.Capacity}</p>
              </div>

              <div>
                {/* 💡 Added dark mode styles */}
                <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">👤 Select Patient *</label>
                <select
                  required
                  value={bookingForm.patientid}
                  onChange={(e) => setBookingForm({ ...bookingForm, patientid: e.target.value })}
                  // 💡 Added dark mode form styles
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
                {/* 💡 Added dark mode styles */}
                <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">📅 Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={bookingForm.duration}
                  onChange={(e) => setBookingForm({ ...bookingForm, duration: e.target.value })}
                  // 💡 Added dark mode form styles
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* 💡 Added dark mode styles */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 dark:bg-yellow-900 dark:border-yellow-600">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  💡 <span className="font-bold">Note:</span> Room availability will be reduced by 1 after booking.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookModal(false)
                    setSelectedRoom(null)
                    setBookingForm({ patientid: '', duration: 1 })
                  }}
                  // 💡 Added dark mode button styles
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 font-bold dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold shadow-lg"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}