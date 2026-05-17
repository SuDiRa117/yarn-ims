const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { createSchema } = require('../migrations/schema');
const db = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database schema
try {
  createSchema(db);
  console.log('Database initialized successfully');
} catch (error) {
  console.error('Database initialization error:', error);
  process.exit(1);
}

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/reports', require('./routes/reports'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuild = path.join(__dirname, '../../frontend/build');
  app.use(express.static(frontendBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
