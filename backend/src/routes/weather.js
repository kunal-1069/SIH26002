const express = require('express');
const router = express.Router();

const CITIES = [
  { name: 'Guwahati (Assam)', lat: 26.1445, lng: 91.7362 },
  { name: 'Shillong (Meghalaya)', lat: 25.5788, lng: 91.8933 },
  { name: 'Tawang (Arunachal)', lat: 27.5861, lng: 91.8594 },
  { name: 'Kohima (Nagaland)', lat: 25.6751, lng: 94.1086 },
  { name: 'Imphal (Manipur)', lat: 24.8170, lng: 93.9368 },
  { name: 'Aizawl (Mizoram)', lat: 23.7271, lng: 92.7176 },
  { name: 'Agartala (Tripura)', lat: 23.8315, lng: 91.2868 }
];

// Helper to convert weather code to emoji and description
function getWeatherDescription(code) {
  if (code >= 95) return { desc: 'Thunderstorm', icon: '⛈️' };
  if (code >= 80) return { desc: 'Heavy Rain', icon: '🌧️' };
  if (code >= 61) return { desc: 'Rain', icon: '🌧️' };
  if (code >= 51) return { desc: 'Drizzle', icon: '🌦️' };
  if (code === 45 || code === 48) return { desc: 'Fog', icon: '🌫️' };
  if (code >= 1 && code <= 3) return { desc: 'Partly Cloudy', icon: '⛅' };
  return { desc: 'Clear Skies', icon: '☀️' };
}

router.get('/live', async (req, res) => {
  try {
    const results = await Promise.all(CITIES.map(async city => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current_weather=true&hourly=precipitation`;
      const response = await fetch(url);
      const data = await response.json();
      
      const current = data.current_weather || {};
      const weatherInfo = getWeatherDescription(current.weathercode || 0);
      
      return {
        name: city.name,
        lat: city.lat,
        lng: city.lng,
        temp: current.temperature,
        windspeed: current.windspeed,
        condition: weatherInfo.desc,
        icon: weatherInfo.icon,
        lastUpdated: current.time || new Date().toISOString()
      };
    }));
    
    res.json({
      timestamp: new Date().toISOString(),
      cities: results
    });
  } catch (error) {
    console.error('Error fetching live weather for tab:', error);
    res.status(500).json({ error: 'Failed to fetch regional weather' });
  }
});

module.exports = router;
