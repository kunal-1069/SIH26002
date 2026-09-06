from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from model import hazard_system, fine_tuner, predict_risk

app = FastAPI(
    title="NER Smart Logistics - Landslide & Flood AI Prediction Service",
    description="Dual-hazard geotechnical & hydrometeorological risk assessment, Dijkstra routing multipliers, and continuous fine-tuning engine.",
    version="2.0.0"
)

# Enable CORS for frontend and backend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Legacy Request Schema
class LegacyRiskRequest(BaseModel):
    road_id: str
    weather_severity: int = Field(..., ge=0, le=10, description="0 to 10 weather severity (10 is severe storm/monsoon cloudburst)")
    historical_incidents: int = Field(default=0, ge=0)
    road_quality: int = Field(default=3, ge=1, le=5)
    rainfall_1h_mm: Optional[float] = None
    rainfall_24h_mm: Optional[float] = None
    rainfall_72h_mm: Optional[float] = None

# Detailed Landslide Request Schema
class LandslideRequest(BaseModel):
    slope_deg: float = Field(..., ge=0, le=90, description="Terrain slope angle in degrees")
    rainfall_24h_mm: float = Field(..., ge=0, description="24-hour cumulative rainfall in mm")
    rainfall_72h_mm: float = Field(default=50.0, ge=0, description="72-hour antecedent rainfall in mm")
    soil_clay_percent: Optional[float] = Field(default=35.0, ge=0, le=100)
    vegetation_ndvi: Optional[float] = Field(default=0.50, ge=0.0, le=1.0)
    historical_incidents: Optional[int] = Field(default=2, ge=0)
    road_quality: Optional[int] = Field(default=3, ge=1, le=5)

# Detailed Flood Request Schema
class FloodRequest(BaseModel):
    elevation_m: float = Field(..., description="Terrain elevation in meters (lowlands < 120m are flood-prone)")
    distance_to_river_m: float = Field(..., ge=0, description="Distance to river channel or drainage outlet in meters")
    rainfall_1h_mm: float = Field(..., ge=0, description="Hourly rainfall intensity in mm/h")
    rainfall_24h_mm: float = Field(..., ge=0, description="24-hour cumulative rainfall in mm")
    road_quality: Optional[int] = Field(default=3, ge=1, le=5)
    soil_clay_percent: Optional[float] = Field(default=35.0, ge=0, le=100)

# Multi-Hazard Request Schema
class ComprehensiveHazardRequest(BaseModel):
    road_id: str = "CORRIDOR_01"
    slope_deg: float = 25.0
    elevation_m: float = 120.0
    rainfall_1h_mm: float = 15.0
    rainfall_24h_mm: float = 65.0
    rainfall_72h_mm: float = 120.0
    soil_clay_percent: float = 38.0
    distance_to_river_m: float = 350.0
    vegetation_ndvi: float = 0.45
    historical_incidents: int = 3
    road_quality: int = 3

# Incident Feed & Fine-Tuning Schemas
class IncidentReport(BaseModel):
    road_corridor: Optional[str] = "Field Report"
    slope_deg: Optional[float] = 30.0
    elevation_m: Optional[float] = 200.0
    rainfall_1h_mm: Optional[float] = 20.0
    rainfall_24h_mm: Optional[float] = 80.0
    rainfall_72h_mm: Optional[float] = 150.0
    soil_clay_percent: Optional[float] = 35.0
    distance_to_river_m: Optional[float] = 400.0
    vegetation_ndvi: Optional[float] = 0.45
    historical_incidents: Optional[int] = 3
    road_quality: Optional[int] = 3
    landslide_occurred: int = Field(..., ge=0, le=1)
    flood_occurred: int = Field(..., ge=0, le=1)
    inundation_depth_cm: Optional[float] = 0.0
    risk_multiplier: Optional[float] = None

class FineTuneBatchRequest(BaseModel):
    mode: str = Field(default="warm_start", description="'warm_start' for incremental tree expansion or 'retrain' for full retrain")
    incidents: List[Dict[str, Any]]

@app.get("/health")
def health_check():
    hazard_system._ensure_loaded()
    return {
        "status": "healthy",
        "service": "NER Hazard AI",
        "model_version": hazard_system.metadata.get("version", "2.0.0")
    }

@app.get("/model_info")
def get_model_info():
    hazard_system._ensure_loaded()
    return hazard_system.metadata

@app.post("/predict_risk")
def calculate_risk(req: LegacyRiskRequest):
    """
    Enhanced backward-compatible endpoint consumed by Express backend routing.js.
    Returns composite risk multiplier and granular hazard metrics.
    """
    comp = hazard_system.predict_legacy_risk(
        road_id=req.road_id,
        weather_severity=req.weather_severity,
        historical_incidents=req.historical_incidents,
        road_quality=req.road_quality,
        rainfall_1h_mm=req.rainfall_1h_mm,
        rainfall_24h_mm=req.rainfall_24h_mm,
        rainfall_72h_mm=req.rainfall_72h_mm
    )
    
    return {
        "road_id": req.road_id,
        "risk_multiplier": comp["risk_multiplier"],
        "status": comp["status"],
        "landslide_probability": comp["landslide"]["landslide_probability"],
        "landslide_hazard_level": comp["landslide"]["hazard_level"],
        "flood_probability": comp["flood"]["flood_probability"],
        "flood_hazard_level": comp["flood"]["hazard_level"],
        "passability_status": comp["flood"]["passability_status"],
        "details": comp
    }

@app.post("/predict/landslide")
def predict_landslide_endpoint(req: LandslideRequest):
    return hazard_system.predict_landslide(req.model_dump())

@app.post("/predict/flood")
def predict_flood_endpoint(req: FloodRequest):
    return hazard_system.predict_flood(req.model_dump())

@app.post("/predict/hazards")
def predict_hazards_endpoint(req: ComprehensiveHazardRequest):
    return hazard_system.predict_comprehensive(req.road_id, req.model_dump())

@app.post("/feed_incident")
def feed_single_incident_endpoint(incident: IncidentReport):
    try:
        res = fine_tuner.feed_single_incident(incident.model_dump())
        return {
            "message": "Incident ingested and model updated successfully",
            "result": res
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/finetune")
def finetune_endpoint(req: FineTuneBatchRequest):
    if not req.incidents:
        raise HTTPException(status_code=400, detail="Incidents list cannot be empty")
    try:
        res = fine_tuner.feed_data(req.incidents, mode=req.mode)
        return {
            "message": f"Fine-tuning completed in mode '{req.mode}'",
            "result": res
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
