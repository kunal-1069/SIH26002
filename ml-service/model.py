import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import pickle
import os

MODEL_PATH = "risk_model.pkl"

def train_dummy_model():
    # Synthetic data for training the risk model
    # Features: weather_severity (0-10), historical_incidents (count), road_quality (1-5, 5 is best)
    # Target: risk_multiplier (1.0 to 5.0)
    data = {
        'weather_severity': [0, 2, 5, 8, 10, 0, 10, 5, 2, 8],
        'historical_incidents': [0, 1, 3, 5, 10, 0, 15, 2, 0, 8],
        'road_quality': [5, 4, 3, 2, 1, 3, 1, 4, 5, 2],
        'risk_multiplier': [1.0, 1.2, 1.8, 3.5, 5.0, 1.1, 5.0, 1.5, 1.0, 4.0]
    }
    df = pd.DataFrame(data)
    
    X = df[['weather_severity', 'historical_incidents', 'road_quality']]
    y = df['risk_multiplier']
    
    model = RandomForestRegressor(n_estimators=10, random_state=42)
    model.fit(X, y)
    
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    print("Model trained and saved.")

def predict_risk(weather_severity, historical_incidents, road_quality):
    if not os.path.exists(MODEL_PATH):
        train_dummy_model()
        
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
        
    df = pd.DataFrame([{
        'weather_severity': weather_severity,
        'historical_incidents': historical_incidents,
        'road_quality': road_quality
    }])
    
    prediction = model.predict(df)[0]
    return round(prediction, 2)

if __name__ == "__main__":
    train_dummy_model()
