from fastapi import FastAPI
from pydantic import BaseModel
from model import predict_risk

app = FastAPI(title="Smart Logistics ML Service")

class RiskRequest(BaseModel):
    road_id: str
    weather_severity: int # 0 to 10 (e.g. 10 is flood/landslide)
    historical_incidents: int
    road_quality: int # 1 to 5

@app.post("/predict_risk")
def calculate_risk(req: RiskRequest):
    risk_multiplier = predict_risk(req.weather_severity, req.historical_incidents, req.road_quality)
    
    return {
        "road_id": req.road_id,
        "risk_multiplier": risk_multiplier,
        "status": "High Risk" if risk_multiplier > 2.0 else "Safe"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
