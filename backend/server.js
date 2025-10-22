require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// connect to DB
connectDB();

app.use(cors());
app.use(express.json());

// ✅ serve uploads with proper headers for PDF embedding
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
      // Enable CORS
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Ensure correct MIME type for PDFs and force inline display
      if (filePath.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf'); 
        res.setHeader('Content-Disposition', 'inline'); 
      }
    },
  })
);

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/export', require('./routes/export'));
app.use('/api/points', require('./routes/points'));

app.get('/', (req, res) => res.send('APTrack backend is running'));

const PORT = process.env.PORT || 5001;

// Start server and attach error handler to avoid unhandled exceptions
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free the port or change PORT in .env.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

// Global handlers to log errors and keep process from crashing silently
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

