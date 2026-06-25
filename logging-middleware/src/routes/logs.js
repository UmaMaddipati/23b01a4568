const express = require('express');
const router = express.Router();

let logs = [];

// GET all logs
router.get('/', (req, res) => {
  res.status(200).json({ logs });
});

// POST a new log
router.post('/', (req, res) => {
  const log = {
    id: Date.now(),
    message: req.body.message,
    level: req.body.level || 'info',
    timestamp: new Date().toISOString()
  };
  logs.push(log);
  res.status(201).json(log);
});

module.exports = router;