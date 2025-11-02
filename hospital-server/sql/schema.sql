-- Create and use the database
CREATE DATABASE hospital_db;
USE hospital_db;
-- ---------------------------------
-- FIX IS HERE
-- Renamed to 'patients' and added 'created_at'
-- ---------------------------------
CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200),
  age INT,
  mobile VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ---------------------------------

CREATE TABLE Doctor(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200),
  specialization VARCHAR(100),
  mobile VARCHAR(30),
  salary DECIMAL(10,2)
);

CREATE TABLE Rooms (
  Room_no INT PRIMARY KEY,
  Room_type VARCHAR(50),
  Capacity INT,
  Availability INT
);

CREATE TABLE Pharmacy(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200),
  location VARCHAR(200)
);

CREATE TABLE Treatment(
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  medicine VARCHAR(200),
  date DATE,
  type VARCHAR(100),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
);

CREATE TABLE Test(
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  test_name VARCHAR(200),
  cost DECIMAL(10,2),
  report TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
);
CREATE TABLE Appointment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  doctor_id INT,
  appointment_date DATETIME,
  reason VARCHAR(255),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL,
  FOREIGN KEY (doctor_id) REFERENCES Doctor(id) ON DELETE SET NULL
);


INSERT INTO Patients (id,name, Age, Mobile) VALUES
(1, 'Rayyan Shaikh', 19, '9876543210'),
(2, 'Darsh Sharma', 20, '9123456780'),
(3, 'Cheeku dosanjh', 19, '9812345678'),
(4, 'Anaya Kanti', 13,'9001122334'),
(5, 'Karan Patel', 30, '9061522318'),
(6, 'Rohan Mehta', 25, '9872953210'),
(7, 'Tanmay Singh', 28, '9120076780'),
(8, 'Naman Mathur', 29, '9812319378'),
(9, 'Arpit Wadhwan', 21,'8621122334'),
(10, 'Sunny Jha', 22, '7701522318'),
 (11, 'Apurva Jha', 24, '9061368118');

INSERT INTO Doctor (id,name , Specialization, mobile,salary ) VALUES
(101, 'Dr. Krish Shaw', 'Cardiologist', '8291056321',100000),
(102, 'Dr. Tanvi Sheth', 'Dermatologist', '9811122233',120000),
(103, 'Dr. Meet Shah', 'Orthopedic', '9900876543',90000),
(104, 'Dr. Kapil Patil', 'Neurologist', '9776655443',95000),
(105, 'Dr. Rohit Malhotra', 'General Physician', '9556677889',50000);

INSERT INTO Rooms(Room_no, Capacity, Availability, Room_type) VALUES
(301, 2, 1, 'Emergency'),
(302, 4, 3, 'General'),       
(303, 3, 2, 'Operation'),    
(304, 1, 0, 'ICU');

INSERT INTO Pharmacy VALUES
(2001, 'Metformin', 'First Floor'),
(2002, 'Cetirizine', 'Third Floor'),
(2003, 'Acetaminophen', 'Ground Floor'),
(2004, 'Advin', 'Second Floor'),
(2005,'Wikoryl','First Floor');


INSERT INTO Treatment (id, patient_id, medicine, date, type)
VALUES
(4001, 1, 'Metformin', '2025-08-02', 'Diabetes'),
(4002, 2, 'Cetirizine', '2025-08-10', 'Skin Allergy'),
(4003, 3, 'Atorvastatin', '2025-08-11', 'Cholesterol'),
(4004, 4, 'Paracetamol', '2025-08-12', 'Migraine'),
(4005, 5, 'Chemotherapy', '2025-08-12', 'Cancer');

INSERT INTO Test (id, patient_id, test_name, cost, report)
VALUES
(5001, 1, 'Hemoglobin A1c', 1200.00, 'Normal blood sugar level'),
(5002, 2, 'Patch Test', 800.00, 'Derm allergic fungal infection'),
(5003, 3, 'LDL and HDL', 1500.00, 'High cholesterol'),
(5004, 4, 'MRI', 5000.00, 'Minor sinus inflammation'),
(5005, 5, 'X-RAY', 4000.00, 'All normal');

INSERT INTO Appointment (id, patient_id, doctor_id, appointment_date, reason)
VALUES
(6001, 1, 101, '2025-08-01 10:00:00', 'Regular diabetes check-up'),
(6002, 2, 102, '2025-08-05 14:30:00', 'Skin rash and itching'),
(6003, 3, 101, '2025-08-07 09:15:00', 'Cholesterol follow-up'),
(6004, 4, 104, '2025-08-09 11:45:00', 'Frequent migraines'),
(6005, 5, 105, '2025-08-10 16:00:00', 'Fever and body pain'),
(6006, 6, 103, '2025-08-12 13:30:00', 'Knee joint pain'),
(6007, 7, 101, '2025-08-15 10:45:00', 'Chest discomfort'),
(6008, 8, 102, '2025-08-16 15:00:00', 'Allergy consultation'),
(6009, 9, 105, '2025-08-17 09:30:00', 'General health check-up'),
(6010, 10, 103, '2025-08-18 12:00:00', 'Back pain');

-- Run this in MySQL to rename columns:
ALTER TABLE Appointment 
CHANGE COLUMN patient_id patientid INT,
CHANGE COLUMN doctor_id doctorid INT,
CHANGE COLUMN appointment_date appointmentdate DATETIME;

-- ✅ STEP 1: Create Audit Log Table
CREATE TABLE patient_delete_log (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  deleted_patient_id INT,
  deleted_patient_name VARCHAR(200),
  deleted_patient_age INT,
  deleted_patient_mobile VARCHAR(30),
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_by VARCHAR(100) DEFAULT 'system'
);

-- ✅ STEP 2: Create TRIGGER to Auto-Log Before Delete
DELIMITER $$

CREATE TRIGGER before_patient_delete
BEFORE DELETE ON patients
FOR EACH ROW
BEGIN
  INSERT INTO patient_delete_log (
    deleted_patient_id,
    deleted_patient_name,
    deleted_patient_age,
    deleted_patient_mobile
  ) VALUES (
    OLD.id,
    OLD.name,
    OLD.age,
    OLD.mobile
  );
END$$

DELIMITER ;

-- ✅ STEP 3: Test the Trigger
-- Delete a test patient to see if logging works
DELETE FROM patients WHERE id = 11;

-- View the audit log
SELECT * FROM patient_delete_log;