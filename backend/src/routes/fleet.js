const express = require('express');
const router = express.Router();

// Get the token and url from the environment
const TRACCAR_URL = process.env.TRACCAR_URL;
const TRACCAR_TOKEN = process.env.TRACCAR_TOKEN;

router.get('/devices', async (req, res) => {
  try {
    const response = await fetch(`${TRACCAR_URL}/api/devices`, {
      headers: {
        'Authorization': `Bearer ${TRACCAR_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Traccar API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching devices from Traccar:', error);
    res.status(500).json({ error: 'Failed to fetch fleet devices' });
  }
});

router.get('/positions', async (req, res) => {
  try {
    const response = await fetch(`${TRACCAR_URL}/api/positions`, {
      headers: {
        'Authorization': `Bearer ${TRACCAR_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Traccar API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching positions from Traccar:', error);
    res.status(500).json({ error: 'Failed to fetch fleet positions' });
  }
});

module.exports = router;
