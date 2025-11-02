const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/', async (req,res)=>{ const [rows]=await db.query('SELECT * FROM Test'); res.json(rows) })
router.post('/', async (req,res)=>{ const {patient_id,test_name,cost,report}=req.body; const [r]=await db.query('INSERT INTO Test (patient_id,test_name,cost,report) VALUES (?,?,?,?)',[patient_id,test_name,cost,report]); res.json({id:r.insertId,patient_id,test_name,cost,report}) })
module.exports = router
