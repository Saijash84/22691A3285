const express = require('express');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Logging Middleware Demo' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint called', data: req.body });
});

app.get('/api/users', (req, res) => {
  res.json({ users: ['John', 'Jane', 'Bob'] });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the logging in action`);
}); 