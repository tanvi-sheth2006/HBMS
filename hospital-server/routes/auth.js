const express = require('express');
const router = express.Router();

// Demo auth - no DB. For production, replace with hashed passwords + DB.
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if(email === 'user@demo' && password === 'password'){
    return res.json({ token: 'demo-token-123', user: { id:1, name:"Demo User", email } });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

module.exports = router;
