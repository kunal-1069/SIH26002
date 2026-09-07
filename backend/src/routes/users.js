const express = require('express');
const router = express.Router();
const { driver } = require('../db/neo4j');
const { sendWelcomeEmail } = require('../services/email');

// POST /api/users/register - Register a new user in Neo4j
router.post('/register', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required.' });
  }

  const session = driver.session();
  try {
    // MERGE ensures we don't create duplicate users with the same email
    const result = await session.run(`
      MERGE (u:User {email: $email})
      ON CREATE SET 
        u.name = $name, 
        u.phone = $phone, 
        u.created_at = datetime()
      RETURN u, u.created_at IS NOT NULL AS is_new
    `, {
      name,
      email,
      phone
    });

    if (result.records.length === 0) {
      throw new Error("Failed to create user node.");
    }

    const record = result.records[0];
    const isNew = record.get('is_new');

    if (!isNew) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    // Attempt to fetch current active hazards to include in welcome email
    let activeHazards = [];
    try {
      // Loopback fetch to the existing hazards endpoint
      const hazardsRes = await fetch('http://localhost:3005/api/hazards/locations');
      if (hazardsRes.ok) {
        const hazardData = await hazardsRes.json();
        if (hazardData.locations) {
          // Filter out CLEAR locations to only get active threats
          activeHazards = hazardData.locations.filter(loc => loc.hazardType !== 'CLEAR');
        }
      }
    } catch (err) {
      console.warn("Failed to fetch current hazards for welcome email:", err.message);
    }

    // Fire background email (fire and forget)
    sendWelcomeEmail(email, name, activeHazards);

    res.status(201).json({ 
      message: 'User registered successfully! Welcome email sent.',
      user: { name, email, phone }
    });

  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'Failed to register user.', details: error.message });
  } finally {
    await session.close();
  }
});

module.exports = router;
