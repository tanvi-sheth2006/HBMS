const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3001; // Port for your backend server

// --- Middleware ---
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON request bodies

// --- MySQL Connection ---
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Tanvi@123",
  database: "hospital_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("✅ Connected to MySQL as ID", connection.threadId);
  connection.release();
});

// =================================================================
// --- API ROUTES (CRUD for Patients) ---
// =================================================================

// 1. CREATE (Add a new patient)
app.post("/api/patients", async (req, res) => {
  try {
    const { name, age, mobile } = req.body;
    if (!name || !age || !mobile) {
      return res.status(400).send({ message: "All fields are required." });
    }
    const sql = "INSERT INTO patients (name, age, mobile) VALUES (?, ?, ?)";
    const [result] = await db.promise().query(sql, [name, age, mobile]);
    res.status(201).send({ id: result.insertId, name, age, mobile });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error adding patient" });
  }
});

// 2. READ (Get all patients)
app.get("/api/patients", async (req, res) => {
  try {
    const sql = "SELECT * FROM patients ORDER BY created_at DESC";
    const [patients] = await db.promise().query(sql);
    res.status(200).send(patients);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching patients" });
  }
});

// 3. UPDATE (Edit an existing patient)
app.put("/api/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, mobile } = req.body;
    const sql =
      "UPDATE patients SET name = ?, age = ?, mobile = ? WHERE id = ?";
    const [result] = await db.promise().query(sql, [name, age, mobile, id]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Patient not found" });
    }
    res.status(200).send({ message: "Patient updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating patient" });
  }
});

// 4. DELETE (Remove a patient)
app.delete("/api/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM patients WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Patient not found" });
    }
    res.status(200).send({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting patient" });
  }
});

// ========================================
// ✅ NEW: Patient Delete Audit Log API (TRIGGER Demo)
// ========================================

// GET all delete logs
app.get("/api/patient-delete-logs", async (req, res) => {
  try {
    const sql = "SELECT * FROM patient_delete_log ORDER BY deleted_at DESC";
    const [logs] = await db.promise().query(sql);
    res.status(200).send(logs);
  } catch (err) {
    console.error("Error fetching delete logs:", err);
    res.status(500).send({ message: "Error fetching delete logs" });
  }
});

// =================================================================
// --- API ROUTES (CRUD for Doctors) ---
// =================================================================

// 1. CREATE (Add Doctor)
app.post("/api/doctors", async (req, res) => {
  try {
    const { name, specialization, mobile, salary } = req.body;
    if (!name || !specialization || !mobile || !salary) {
      return res.status(400).send({ message: "All fields are required." });
    }
    const sql =
      "INSERT INTO Doctor (name, specialization, mobile, salary) VALUES (?, ?, ?, ?)";
    const [result] = await db
      .promise()
      .query(sql, [name, specialization, mobile, salary]);
    res.status(201).send({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error adding doctor" });
  }
});

// 2. READ (Get all Doctors)
app.get("/api/doctors", async (req, res) => {
  try {
    const sql = "SELECT * FROM Doctor";
    const [doctors] = await db.promise().query(sql);
    res.status(200).send(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching doctors" });
  }
});

// 3. UPDATE (Edit Doctor)
app.put("/api/doctors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, mobile, salary } = req.body;
    const sql =
      "UPDATE Doctor SET name = ?, specialization = ?, mobile = ?, salary = ? WHERE id = ?";
    const [result] = await db
      .promise()
      .query(sql, [name, specialization, mobile, salary, id]);
    if (result.affectedRows === 0)
      return res.status(404).send({ message: "Doctor not found" });
    res.status(200).send({ message: "Doctor updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating doctor" });
  }
});

// 4. DELETE (Remove Doctor)
app.delete("/api/doctors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM Doctor WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);
    if (result.affectedRows === 0)
      return res.status(404).send({ message: "Doctor not found" });
    res.status(200).send({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting doctor" });
  }
});

// =================================================================
// --- API ROUTES (CRUD for Rooms) ---
// =================================================================

// 1. CREATE (Add Room)
app.post("/api/rooms", async (req, res) => {
  try {
    const { Room_no, Room_type, Capacity, Availability } = req.body;
    if (!Room_no || !Room_type || !Capacity) {
      return res
        .status(400)
        .send({ message: "Room_no, Room_type, and Capacity are required." });
    }
    const initialAvailability =
      Availability !== undefined ? Availability : Capacity;
    const sql =
      "INSERT INTO Rooms (Room_no, Room_type, Capacity, Availability) VALUES (?, ?, ?, ?)";
    const [result] = await db
      .promise()
      .query(sql, [Room_no, Room_type, Capacity, initialAvailability]);
    res.status(201).send({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error("Error adding room:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .send({ message: `Room number ${req.body.Room_no} already exists.` });
    }
    res.status(500).send({ message: "Error adding room" });
  }
});

// 2. READ (Get all Rooms)
app.get("/api/rooms", async (req, res) => {
  try {
    const sql =
      "SELECT Room_no, Room_type, Capacity, Availability FROM Rooms ORDER BY Room_no ASC";
    const [rooms] = await db.promise().query(sql);
    res.status(200).send(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).send({ message: "Error fetching rooms" });
  }
});

// 3. UPDATE (Edit Room)
app.put("/api/rooms/:Room_no", async (req, res) => {
  try {
    const { Room_no } = req.params;
    const { Availability, Room_type, Capacity } = req.body;
    const updates = [];
    const values = [];
    if (Availability !== undefined) {
      updates.push("Availability = ?");
      values.push(Availability);
    }
    if (Room_type !== undefined) {
      updates.push("Room_type = ?");
      values.push(Room_type);
    }
    if (Capacity !== undefined) {
      updates.push("Capacity = ?");
      values.push(Capacity);
    }
    if (updates.length === 0) {
      return res
        .status(400)
        .send({ message: "No fields provided for update." });
    }
    const sql = `UPDATE Rooms SET ${updates.join(", ")} WHERE Room_no = ?`;
    values.push(Room_no);
    const [result] = await db.promise().query(sql, values);
    if (result.affectedRows === 0)
      return res.status(404).send({ message: `Room ${Room_no} not found` });
    res.status(200).send({ message: "Room updated successfully" });
  } catch (err) {
    console.error("Error updating room:", err);
    res.status(500).send({ message: "Error updating room" });
  }
});

// 4. DELETE (Remove Room)
app.delete("/api/rooms/:Room_no", async (req, res) => {
  try {
    const { Room_no } = req.params;
    const sql = "DELETE FROM Rooms WHERE Room_no = ?";
    const [result] = await db.promise().query(sql, [Room_no]);
    if (result.affectedRows === 0)
      return res.status(404).send({ message: `Room ${Room_no} not found` });
    res.status(200).send({ message: "Room deleted successfully" });
  } catch (err) {
    console.error("Error deleting room:", err);
    res.status(500).send({ message: "Error deleting room" });
  }
});

// =================================================================
// --- API ROUTES (CRUD for Treatments) ---
// =================================================================

// 1. CREATE (Add Treatment)
app.post("/api/treatments", async (req, res) => {
  try {
    const { patient_id, medicine, date, type } = req.body;
    if (!patient_id || !medicine || !date || !type) {
      return res.status(400).send({ message: "All fields are required." });
    }
    const sql =
      "INSERT INTO Treatment (patient_id, medicine, date, type) VALUES (?, ?, ?, ?)";
    const [result] = await db
      .promise()
      .query(sql, [patient_id, medicine, date, type]);
    res.status(201).send({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error adding treatment" });
  }
});

// 2. READ (Get all Treatments)
app.get("/api/treatments", async (req, res) => {
  try {
    const sql = "SELECT * FROM Treatment";
    const [treatments] = await db.promise().query(sql);
    res.status(200).send(treatments);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching treatments" });
  }
});

// 3. UPDATE (Edit Treatment)
app.put("/api/treatments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, medicine, date, type } = req.body;
    const sql =
      "UPDATE Treatment SET patient_id = ?, medicine = ?, date = ?, type = ? WHERE id = ?";
    const [result] = await db
      .promise()
      .query(sql, [patient_id, medicine, date, type, id]);
    if (result.affectedRows === 0)
      return res.status(404).send({ message: "Treatment not found" });
    res.status(200).send({ message: "Treatment updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating treatment" });
  }
});

// 4. DELETE (Remove Treatment)
app.delete("/api/treatments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM Treatment WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);
    if (result.affectedRows === 0)
      return res.status(404).send({ message: "Treatment not found" });
    res.status(200).send({ message: "Treatment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting treatment" });
  }
});

// =================================================================
// --- API ROUTES (CRUD for Tests) ---
// =================================================================

// 1. CREATE (Add Test)
app.post("/api/tests", async (req, res) => {
  try {
    const { patient_id, test_name, cost, report } = req.body;
    if (!patient_id || !test_name || !cost) {
      return res
        .status(400)
        .send({ message: "Patient ID, test name, and cost are required." });
    }
    const sql =
      "INSERT INTO Test (patient_id, test_name, cost, report) VALUES (?, ?, ?, ?)";
    const [result] = await db
      .promise()
      .query(sql, [patient_id, test_name, cost, report || null]);
    res.status(201).send({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error adding test" });
  }
});

// 2. READ (Get all Tests WITH JOIN)
app.get("/api/tests", async (req, res) => {
  try {
    const sql = `
      SELECT 
        t.id, 
        t.test_name,
        t.cost,
        t.report,
        p.name AS patient_name,
        p.age AS patient_age,
        t.patient_id
      FROM 
        Test t
      JOIN 
        patients p ON t.patient_id = p.id
      ORDER BY
        t.id 
    `;
    const [tests] = await db.promise().query(sql);
    res.status(200).send(tests);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching tests" });
  }
});

// 3. UPDATE (Edit Test)
app.put("/api/tests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, test_name, cost, report } = req.body;
    const sql =
      "UPDATE Test SET patient_id = ?, test_name = ?, cost = ?, report = ? WHERE id = ?";
    const [result] = await db
      .promise()
      .query(sql, [patient_id, test_name, cost, report, id]);
    if (result.affectedRows === 0)
      return res.status(404).send({ message: "Test not found" });
    res.status(200).send({ message: "Test updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating test" });
  }
});

// 4. DELETE (Remove Test)
app.delete("/api/tests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM Test WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);
    if (result.affectedRows === 0)
      return res.status(404).send({ message: "Test not found" });
    res.status(200).send({ message: "Test deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting test" });
  }
});

// =================================================================
// --- API ROUTES (CRUD for Pharmacy) ---
// =================================================================

// 1. READ (Get all Medicines)
app.get("/api/pharmacy", async (req, res) => {
  try {
    const sql = "SELECT * FROM Pharmacy ORDER BY name ASC";
    const [medicines] = await db.promise().query(sql);
    res.status(200).send(medicines);
  } catch (err) {
    console.error("Error fetching pharmacy medicines:", err);
    res.status(500).send({ message: "Error fetching medicines" });
  }
});

// 2. CREATE (Add new Medicine)
app.post("/api/pharmacy", async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !location) {
      return res
        .status(400)
        .send({ message: "Name and location are required." });
    }
    const sql = "INSERT INTO Pharmacy (name, location) VALUES (?, ?)";
    const [result] = await db.promise().query(sql, [name, location]);
    res.status(201).send({ id: result.insertId, name, location });
  } catch (err) {
    console.error("Error adding medicine:", err);
    res.status(500).send({ message: "Error adding medicine" });
  }
});

// 3. UPDATE (Edit Medicine)
app.put("/api/pharmacy/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    if (!name || !location) {
      return res
        .status(400)
        .send({ message: "Name and location are required." });
    }
    const sql = "UPDATE Pharmacy SET name = ?, location = ? WHERE id = ?";
    const [result] = await db.promise().query(sql, [name, location, id]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Medicine not found" });
    }
    res.status(200).send({ message: "Medicine updated successfully" });
  } catch (err) {
    console.error("Error updating medicine:", err);
    res.status(500).send({ message: "Error updating medicine" });
  }
});

// 4. DELETE (Remove Medicine)
app.delete("/api/pharmacy/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM Pharmacy WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Medicine not found" });
    }
    res.status(200).send({ message: "Medicine deleted successfully" });
  } catch (err) {
    console.error("Error deleting medicine:", err);
    res.status(500).send({ message: "Error deleting medicine" });
  }
});

// =================================================================
// --- API ROUTES (CRUD for Appointments) ---
// =================================================================

// 1. CREATE (Add Appointment)
app.post("/api/appointments", async (req, res) => {
  try {
    const { patientid, doctorid, appointmentdate, reason } = req.body;
    if (!patientid || !doctorid || !appointmentdate) {
      return res
        .status(400)
        .send({ message: "Patient, doctor, and date are required." });
    }
    const sql =
      "INSERT INTO Appointment (patientid, doctorid, appointmentdate, reason) VALUES (?, ?, ?, ?)";
    const [result] = await db
      .promise()
      .query(sql, [patientid, doctorid, appointmentdate, reason || null]);
    res.status(201).send({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error("Error adding appointment:", err);
    res
      .status(500)
      .send({ message: "Error adding appointment", details: err.message });
  }
});

// 2. READ (Get all Appointments WITH JOINS)
app.get("/api/appointments", async (req, res) => {
  try {
    const sql = `
      SELECT 
        a.id, 
        a.appointmentdate,
        a.reason,
        a.patientid,
        a.doctorid,
        p.name AS patient_name,
        p.mobile AS patient_mobile,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization
      FROM 
        Appointment a
      JOIN 
        patients p ON a.patientid = p.id
      JOIN 
        Doctor d ON a.doctorid = d.id
      ORDER BY 
        a.appointmentdate DESC
    `;
    const [appointments] = await db.promise().query(sql);
    res.status(200).send(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).send({ message: "Error fetching appointments" });
  }
});

// 3. UPDATE (Edit Appointment)
app.put("/api/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { patientid, doctorid, appointmentdate, reason } = req.body;
    const sql =
      "UPDATE Appointment SET patientid = ?, doctorid = ?, appointmentdate = ?, reason = ? WHERE id = ?";
    const [result] = await db
      .promise()
      .query(sql, [patientid, doctorid, appointmentdate, reason, id]);
    if (result.affectedRows === 0)
      return res.status(404).send({ message: "Appointment not found" });
    res.status(200).send({ message: "Appointment updated successfully" });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).send({ message: "Error updating appointment" });
  }
});

// 4. DELETE (Remove Appointment)
app.delete("/api/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM Appointment WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);
    if (result.affectedRows === 0)
      return res.status(404).send({ message: "Appointment not found" });
    res.status(200).send({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).send({ message: "Error deleting appointment" });
  }
});

// =================================================================
// --- CHATBOT API ROUTE ---
// =================================================================

app.post("/api/chatbot", (req, res) => {
  const userMessage = req.body?.message?.toLowerCase().trim() || "";

  let reply =
    "I'm sorry, I can only assist with questions about doctors, appointments, pharmacy, hours, and medical symptoms. Please rephrase.";

  // Hospital Services & Logistics
  if (
    userMessage.includes("appointment") ||
    userMessage.includes("book") ||
    userMessage.includes("schedule")
  ) {
    reply =
      "You can book an appointment by visiting the 'Appointments' section or by calling our front desk at 555-1234.";
  } else if (
    userMessage.includes("doctor") ||
    userMessage.includes("specialist")
  ) {
    reply =
      "We have specialists in Cardiology, Neurology, and Pediatrics. You can see all available doctors on the 'Doctors' page.";
  } else if (
    userMessage.includes("pharmacy") ||
    userMessage.includes("medicine") ||
    userMessage.includes("medication")
  ) {
    reply =
      "Our hospital pharmacy is located on the Ground Floor and is open 24/7. You can check medicine availability on the 'Pharmacy' page.";
  } else if (
    userMessage.includes("hours") ||
    userMessage.includes("open") ||
    userMessage.includes("location") ||
    userMessage.includes("address")
  ) {
    reply =
      "The main hospital is open 24/7 for emergencies. Specialist consultation hours are from 9 AM to 5 PM, Monday to Friday.";
  } else if (
    userMessage.includes("visiting hours") ||
    userMessage.includes("visit")
  ) {
    reply =
      "Visiting hours for general wards are from 11 AM to 1 PM and 5 PM to 7 PM daily.";
  } // Medical Queries
  else if (
    userMessage.includes("fever") ||
    userMessage.includes("cough") ||
    userMessage.includes("headache") ||
    userMessage.includes("pain")
  ) {
    reply =
      "I understand you're not feeling well. For any symptoms, I recommend booking a consultation with one of our doctors. For severe symptoms or emergencies, please call 311.";
  } else if (
    userMessage.includes("emergency") ||
    userMessage.includes("ambulance")
  ) {
    reply =
      "For any medical emergency, please call 311 immediately. Our hospital emergency room is open 24/7.";
  }

  res.json({ reply: reply });
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
