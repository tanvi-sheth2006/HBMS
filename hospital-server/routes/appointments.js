const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all appointments
router.get('/', async (req,res)=>{
  try {
    const [rows] = await db.query('SELECT * FROM Appointments');
    res.json(rows || []);
  } catch(e){
    res.json([]);
  }
});

// POST book appointment
router.post('/', async (req,res)=>{
  const { name, date, doctor } = req.body;
  try {
    const [result] = await db.query('INSERT INTO Appointments (name, date, doctor, status) VALUES (?, ?, ?, ?)', [name, date, doctor, 'booked']);
    res.json({ id: result.insertId, name, date, doctor });
  } catch(e){
    res.status(500).json({ error: 'db error' });
  }
});

module.exports = router;
