const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req,res)=>{
  try {
    const [rows] = await db.query('SELECT * FROM Pharmacy');
    res.json(rows);
  } catch(e){
    res.json([]);
  }
});

module.exports = router;
