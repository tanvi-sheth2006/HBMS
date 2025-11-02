const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/', async (req,res)=>{ const [rows]=await db.query('SELECT * FROM Treatment'); res.json(rows) })
router.post('/', async (req,res)=>{ const {patient_id,medicine,date,type}=req.body; const [r]=await db.query('INSERT INTO Treatment (patient_id,medicine,date,type) VALUES (?,?,?,?)',[patient_id,medicine,date,type]); res.json({id:r.insertId,patient_id,medicine,date,type}) })
module.exports = router
