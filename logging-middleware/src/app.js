const express = require('express');
const cors = require('cors');
const logsRouter = require('./routes/logs');

const app = express();
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/logs', logsRouter);

app.listen(3000, () => console.log('Logging middleware running on 3000'));
module.exports = app;