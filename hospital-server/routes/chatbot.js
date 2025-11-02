const express = require('express');
const router = express.Router();

// lightweight canned chatbot logic. Later you can plug OpenAI or other NLP engines.
router.post('/', (req,res) => {
  const { message } = req.body;
  const m = (message || "").toLowerCase();

  if(m.includes("appointment")) return res.json({ reply: "To book an appointment, go to the Appointments page or tell me the patient name and preferred date." });
  if(m.includes("medicine") || m.includes("pharmacy")) return res.json({ reply: "You can browse pharmacy products on the Pharmacy page. Need help finding a medicine?" });
  if(m.includes("doctor") || m.includes("specialist")) return res.json({ reply: "We have cardiologists, neurologists, and pediatricians. Which specialty do you need?" });

  return res.json({ reply: "Thanks for contacting CityCare. For appointments dial +91-1234567890 or say 'book appointment'." });
});

module.exports = router;
