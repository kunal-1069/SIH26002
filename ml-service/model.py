"""
ML Service Model Interface
Provides unified access to the Dual-Hazard Prediction Engine and Fine-Tuning Pipeline.
Retains 100% backward compatibility for legacy calculate_risk callers.
"""

from hazard_models import hazard_system
from finetune import FineTuningEngine

# Initialize singleton engine
fine_tuner = FineTuningEngine()

def predict_risk(weather_severity: int, historical_incidents: int, road_quality: int, road_id: str = "DEFAULT"):
    """
    Backward-compatible prediction function matching the original model.py signature.
    Returns the calculated composite risk multiplier (1.0 - 5.0).
    """
    result = hazard_system.predict_legacy_risk(
        road_id=road_id,
        weather_severity=weather_severity,
        historical_incidents=historical_incidents,
        road_quality=road_quality
    )
    return result['risk_multiplier']

def predict_comprehensive_risk(road_id: str, params: dict):
    """
    Advanced multi-hazard prediction interface providing landslide, flood,
    and routing penalty factors.
    """
    return hazard_system.predict_comprehensive(road_id, params)

if __name__ == "__main__":
    test_mult = predict_risk(weather_severity=8, historical_incidents=5, road_quality=2)
    print(f"Legacy predict_risk result: {test_mult}")
