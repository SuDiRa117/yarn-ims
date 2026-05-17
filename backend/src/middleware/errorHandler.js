const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Duplicate entry detected' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;
