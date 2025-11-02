const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/', async (req,res)=>{
  const [rows] = await db.query('SELECT * FROM Doctor')
  res.json(rows)
})
router.post('/', async (req,res)=>{
  const {name,specialization,mobile,salary} = req.body
  const [r] = await db.query('INSERT INTO Doctor (name,specialization,mobile,salary) VALUES (?,?,?,?)', [name,specialization,mobile,salary])
  res.json({id: r.insertId, name,specialization,mobile,salary})
})
module.exports = router
