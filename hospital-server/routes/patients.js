const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/', async (req,res)=>{
  const [rows] = await db.query('SELECT * FROM Patient')
  res.json(rows)
})

router.post('/', async (req,res)=>{
  const {name, age, mobile} = req.body
  const [result] = await db.query('INSERT INTO Patient (name, age, mobile) VALUES (?, ?, ?)', [name, age, mobile])
  res.json({id: result.insertId, name, age, mobile})
})

router.delete('/:id', async (req,res)=>{
  const id=req.params.id
  await db.query('DELETE FROM Patient WHERE id=?', [id])
  res.json({deletedId: id})
})

module.exports = router
