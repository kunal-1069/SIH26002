
// if node 18+, fetch is native. We'll use native.

async function testWeather() {
  const lat = 26.1445;
  const lng = 91.7362;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=precipitation`;
  console.log(`Fetching from: ${url}`);
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Current Weather:", data.current_weather);
    console.log("Hourly Precipitation (first 5 hrs):", data.hourly.precipitation.slice(0, 5));
    
    const soilUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=soil_moisture_0_to_7cm`;
    const soilRes = await fetch(soilUrl);
    const soilData = await soilRes.json();
    console.log("Soil Data:", soilData);
    
  } catch (err) {
    console.error("Error:", err);
  }
}

testWeather();
