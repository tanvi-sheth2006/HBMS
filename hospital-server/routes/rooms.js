const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/', async (req,res)=>{ const [rows] = await db.query('SELECT * FROM Rooms'); res.json(rows) })
router.put('/:id', async (req,res)=>{ const {status} = req.body; const id=req.params.id; await db.query('UPDATE Rooms SET status=? WHERE id=?', [status,id]); res.json({id,status}) })
module.exports = router
