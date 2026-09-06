const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const fleetRoutes = require('./routes/fleet');
const routingRoutes = require('./routes/routing');
const hazardRoutes = require('./routes/hazards');
// const reportRoutes = require('./routes/reports');

app.use('/api/fleet', fleetRoutes);
app.use('/api/route', routingRoutes);
app.use('/api/hazards', hazardRoutes);
// app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Smart Logistics API');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Smart Logistics Backend listening on port ${port}`);
});
