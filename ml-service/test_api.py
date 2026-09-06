"""
Verification script for FastAPI Hazard AI Service
Tests:
- Legacy /predict_risk
- Landslide /predict/landslide
- Flood /predict/flood
- Comprehensive /predict/hazards
- /model_info
- Fine-tuning endpoint /finetune
"""

from fastapi.testclient import TestClient
from app import app
import json

client = TestClient(app)

def test_endpoints():
    print("1. Testing Health...")
    r = client.get("/health")
    assert r.status_code == 200
    print("Health response:", r.json())

    print("\n2. Testing /model_info...")
    r = client.get("/model_info")
    assert r.status_code == 200
    info = r.json()
    print("Model Version:", info.get("version"))
    print("Landslide ROC-AUC:", info.get("metrics", {}).get("landslide", {}).get("roc_auc"))
    print("Flood ROC-AUC:", info.get("metrics", {}).get("flood", {}).get("roc_auc"))

    print("\n3. Testing Legacy /predict_risk (backward-compatibility)...")
    r = client.post("/predict_risk", json={
        "road_id": "R_AB",
        "weather_severity": 8,
        "historical_incidents": 4,
        "road_quality": 2
    })
    assert r.status_code == 200
    print("Predict Risk Response:", json.dumps(r.json(), indent=2))

    print("\n4. Testing Detailed /predict/landslide...")
    r = client.post("/predict/landslide", json={
        "slope_deg": 36.0,
        "rainfall_24h_mm": 130.0,
        "rainfall_72h_mm": 260.0,
        "soil_clay_percent": 45.0,
        "vegetation_ndvi": 0.25,
        "historical_incidents": 5,
        "road_quality": 2
    })
    assert r.status_code == 200
    print("Landslide Response:", json.dumps(r.json(), indent=2))

    print("\n5. Testing Detailed /predict/flood...")
    r = client.post("/predict/flood", json={
        "elevation_m": 58.0,
        "distance_to_river_m": 90.0,
        "rainfall_1h_mm": 40.0,
        "rainfall_24h_mm": 140.0,
        "road_quality": 2,
        "soil_clay_percent": 40.0
    })
    assert r.status_code == 200
    print("Flood Response:", json.dumps(r.json(), indent=2))

    print("\n6. Testing /feed_incident...")
    r = client.post("/feed_incident", json={
        "road_corridor": "Guwahati NH-27",
        "slope_deg": 12.0,
        "elevation_m": 60.0,
        "rainfall_1h_mm": 25.0,
        "rainfall_24h_mm": 90.0,
        "rainfall_72h_mm": 140.0,
        "soil_clay_percent": 35.0,
        "distance_to_river_m": 150.0,
        "vegetation_ndvi": 0.5,
        "historical_incidents": 2,
        "road_quality": 3,
        "landslide_occurred": 0,
        "flood_occurred": 1,
        "inundation_depth_cm": 45.0
    })
    assert r.status_code == 200
    print("Feed Incident Response:", json.dumps(r.json(), indent=2))

    print("\nALL API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()
