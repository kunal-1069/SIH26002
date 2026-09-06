# AI Model Documentation: Landslide & Flood Prediction System for NER Logistics

## 1. Executive Summary

In the **North Eastern Region (NER) of India** (Assam, Meghalaya, Arunachal Pradesh, Sikkim, Nagaland, Manipur, Mizoram, Tripura), transportation networks frequently face severe disruptions due to two interrelated natural hazards:
1. **Rainfall-Induced Landslides**: Catastrophic slope failures along steep mountainous highways (e.g., NH-06 Guwahati-Shillong corridor, NH-10 Sikkim corridor, NH-37).
2. **Monsoon Floods & Flash Waterlogging**: Inundation of lowland arterial corridors across the Brahmaputra and Barak river basins (e.g., Guwahati, Silchar, Dibrugarh).

This document provides a comprehensive technical reference for the **Dual-Hazard AI Prediction & Continual Fine-Tuning Engine** implemented in `ml-service`. The system translates multi-parameter geotechnical, hydrological, and meteorological inputs into calibrated failure probabilities, inundation depths, and routing cost multipliers consumed directly by the platform's Dijkstra graph navigation engine.

---

## 2. Geotechnical & Hydrological Physics Foundation

### 2.1 Landslide Trigger Mechanics
The model's geotechnical feature space is grounded in the **Infinite Slope Stability Model**:

$$\text{Factor of Safety (FoS)} = \frac{c' + (\gamma z - u_w) \cos^2\beta \tan\phi'}{\gamma z \sin\beta \cos\beta}$$

Where:
- $\beta$: Slope inclination angle (`slope_deg`). Slopes $>25^\circ$ experience exponential increases in shear stress.
- $u_w$: Pore water pressure, driven by short-term high-intensity rainfall (`rainfall_24h_mm`) and antecedent deep soil saturation (`rainfall_72h_mm`).
- $c'$: Effective soil cohesion, modulated by root reinforcement (`vegetation_ndvi`) and clay softening (`soil_clay_percent`).
- Road retaining structures and culverts (`road_quality`) provide engineered resistance against failure.

### 2.2 Flood & Inundation Mechanics
Lowland flood susceptibility follows hydrological catchment principles:
- **Elevation Basin ($z$)**: Corridors with elevation $<120\text{ m}$ in the Brahmaputra basin function as natural retention basins.
- **Proximity to River Channel ($d_{river}$)**: Infiltration excess and river overtopping risk decay exponentially with distance ($e^{-d_{river} / 450}$).
- **Storm Deluge Trigger**: 1-hour cloudburst intensity (`rainfall_1h_mm`) exceeding $35\text{ mm/h}$ or 24-hour accumulation exceeding $100\text{ mm}$ causes rapid surcharge of highway drainage culverts.

---

## 3. System Architecture & Model Pipeline

The prediction service implements a **modular multi-task ensemble architecture**:

```
                              ┌────────────────────────────────────────┐
                              │ Input Geotechnical & Weather Features  │
                              └───────────────────┬────────────────────┘
                                                  │
                      ┌───────────────────────────┴───────────────────────────┐
                      ▼                                                       ▼
        ┌───────────────────────────┐                           ┌───────────────────────────┐
        │  Landslide Predictor      │                           │  Flood Hazard Predictor   │
        │  (RandomForest Ensemble)  │                           │  (Dual Ensemble)          │
        └─────────────┬─────────────┘                           └─────────────┬─────────────┘
                      │                                                       │
                      ├─ P(Landslide) [0.0 - 1.0]                             ├─ P(Flood) [0.0 - 1.0]
                      ├─ Severity (Low/Mod/High/Severe)                       ├─ Inundation Depth (cm)
                      └─ Primary Failure Triggers                             └─ Passability Classification
                                                  │
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │ Composite Dijkstra Multiplier Engine   │
                              │ (RandomForest Regressor + Clamp Logic) │
                              └───────────────────┬────────────────────┘
                                                  │
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │ Dynamic Edge Weight:                   │
                              │ current_time = base_time * multiplier  │
                              └────────────────────────────────────────┘
```

### Models in the Ensemble:
1. **`landslide_clf` (`RandomForestClassifier`)**:
   - 100 estimators, max depth 12, warm-start enabled.
   - Evaluates slope gradient, 24h rain, 72h antecedent saturation, clay fraction, NDVI, historical incidents, and road quality.
2. **`flood_clf` (`RandomForestClassifier`)**:
   - 100 estimators, max depth 12, warm-start enabled.
   - Predicts inundation occurrence and probability.
3. **`flood_depth_reg` (`RandomForestRegressor`)**:
   - 60 estimators, trained on flooded regimes to estimate standing water column ($5\text{ cm} - 180\text{ cm}$).
4. **`risk_mult_reg` (`RandomForestRegressor`)**:
   - 80 estimators, predicts the continuous routing cost multiplier ($1.0\times - 5.0\times$) for Neo4j Dijkstra shortest-path calculations.

---

## 4. Feature Dictionary

| Feature Name | Data Type | Units / Range | Category | Description |
| :--- | :--- | :--- | :--- | :--- |
| `slope_deg` | `float` | $0.0^\circ - 70.0^\circ$ | Geotechnical | Slope steepness along the cut bank or hillslope. |
| `elevation_m` | `float` | $40\text{ m} - 2500\text{ m}$ | Topographic | Altitude above sea level. Lowlands $<120\text{ m}$ have high flood vulnerability. |
| `rainfall_1h_mm` | `float` | $0.0 - 100.0\text{ mm}$ | Hydrometeorological | Short-duration cloudburst intensity. |
| `rainfall_24h_mm` | `float` | $0.0 - 400.0\text{ mm}$ | Hydrometeorological | 24-hour cumulative rainfall. Primary trigger for slope failure. |
| `rainfall_72h_mm` | `float` | $0.0 - 800.0\text{ mm}$ | Hydrometeorological | 3-day antecedent precipitation index (soil saturation proxy). |
| `soil_clay_percent`| `float` | $10.0\% - 65.0\%$ | Geotechnical | Clay fraction. High clay expands and softens during heavy rain. |
| `distance_to_river_m`| `float` | $10\text{ m} - 5000\text{ m}$ | Hydrological | Distance to nearest river channel or major drainage nullah. |
| `vegetation_ndvi` | `float` | $0.05 - 0.90$ | Ecological | Normalized Difference Vegetation Index. High canopy provides root cohesion. |
| `historical_incidents`| `int` | $0 - 25$ | Historical | Number of past documented landslide or flood blockages on this corridor. |
| `road_quality` | `int` | $1 - 5$ | Structural | 1 = Unpaved/eroded; 3 = Standard asphalt; 5 = Reinforced multi-lane highway. |

---

## 5. Model Performance & Benchmarks

The models were calibrated and validated on a stratified test partition ($N = 800$) modeling real NER highway conditions:

### 5.1 Landslide Classification Metrics
- **ROC-AUC**: **0.8777** (87.8% discrimination capability)
- **Accuracy**: **81.13%**
- **Precision**: **79.80%**
- **Recall**: **59.56%**
- **F1-Score**: **0.6821**
- **Feature Importances**:
  1. `slope_deg`: **26.92%**
  2. `rainfall_24h_mm`: **24.18%**
  3. `rainfall_72h_mm`: **23.99%**
  4. `vegetation_ndvi`: **8.98%**
  5. `soil_clay_percent`: **8.71%**
  6. `historical_incidents`: **3.99%**
  7. `road_quality`: **3.23%**

### 5.2 Flood Classification Metrics
- **ROC-AUC**: **0.8333** (83.3% discrimination capability)
- **Accuracy**: **77.75%**
- **Precision**: **67.94%**
- **Recall**: **56.13%**
- **F1-Score**: **0.6147**
- **Feature Importances**:
  1. `elevation_m`: **28.44%**
  2. `rainfall_24h_mm`: **20.94%**
  3. `distance_to_river_m`: **18.70%**
  4. `rainfall_1h_mm`: **17.87%**
  5. `soil_clay_percent`: **10.56%**
  6. `road_quality`: **3.49%**

### 5.3 Routing Multiplier Regression Metrics
- **$R^2$ Score**: **0.9527** (95.3% of variance in route delays explained)
- **Root Mean Squared Error (RMSE)**: **0.2039**

---

## 6. Fine-Tuning & Continual Learning Guide

The system provides dual-mode continuous learning so you can ingest new observations gathered from field inspections, mobile incident reports, or government disaster bulletins.

### 6.1 Fine-Tuning Modes
1. **Incremental Warm-Start (`mode: "warm_start"`)**:
   - Ideal for single incidents or daily field feeds ($1 - 50$ records).
   - Expands the existing ensemble with additional decision trees without resetting previously learned weights.
   - Fast execution ($<1$ second).
2. **Calibrated Retraining (`mode: "retrain"`)**:
   - Ideal for seasonal dataset updates or bulk historical imports ($>100$ records).
   - Combines historical archives with newly ingested records and retrains all trees with full cross-validation and feature re-weighting.

### 6.2 CLI Fine-Tuning
You can fine-tune directly from the command line:

```bash
# 1. Create a sample CSV template with new observations
python finetune.py --create-sample

# 2. Fine-tune incrementally using warm-start
python finetune.py --data sample_field_feed.csv --mode warm_start

# 3. Perform full calibrated retrain
python finetune.py --data new_season_data.csv --mode retrain
```

### 6.3 Automated Checkpointing & Rollback
Before any fine-tuning operation begins:
- An automatic timestamped checkpoint of the model weights is saved in `ml-service/checkpoints/` (e.g. `hazard_bundle_backup_YYYYMMDD_HHMMSS.pkl`).
- Metadata history is appended in `model_metadata.json` tracking timestamp, sample count, and validation metric deltas.

---

## 7. API Reference

The FastAPI service runs on port `8000` (and is proxied via the Express backend at port `3001`).

### 7.1 `POST /predict_risk` (Backward-Compatible Routing Endpoint)
**Request**:
```json
{
  "road_id": "R_AB",
  "weather_severity": 8,
  "historical_incidents": 4,
  "road_quality": 2
}
```
**Response**:
```json
{
  "road_id": "R_AB",
  "risk_multiplier": 3.56,
  "status": "Extreme Hazard - Route Diverted",
  "landslide_probability": 0.755,
  "landslide_hazard_level": "High",
  "flood_probability": 0.4615,
  "flood_hazard_level": "Minor Waterlogging",
  "passability_status": "Passable (Slow speed)"
}
```

### 7.2 `POST /predict/landslide` (Detailed Landslide Analysis)
**Request**:
```json
{
  "slope_deg": 38.0,
  "rainfall_24h_mm": 130.0,
  "rainfall_72h_mm": 280.0,
  "soil_clay_percent": 45.0,
  "vegetation_ndvi": 0.25,
  "historical_incidents": 5,
  "road_quality": 2
}
```
**Response**:
```json
{
  "landslide_probability": 0.8394,
  "hazard_level": "Severe / Critical",
  "predicted_occurrence": true,
  "recommendation": "Severe slope failure hazard. Immediate road closure or detour recommended.",
  "primary_triggers": [
    "Steep gradient (38.0°)",
    "Heavy 24h rain (130.0mm)",
    "Deep pore water saturation from 72h rain (280.0mm)",
    "Low vegetation / exposed slope"
  ]
}
```

### 7.3 `POST /predict/flood` (Detailed Flood Analysis)
**Request**:
```json
{
  "elevation_m": 58.0,
  "distance_to_river_m": 90.0,
  "rainfall_1h_mm": 40.0,
  "rainfall_24h_mm": 140.0,
  "road_quality": 2,
  "soil_clay_percent": 40.0
}
```
**Response**:
```json
{
  "flood_probability": 0.8886,
  "hazard_level": "Severe Inundation",
  "estimated_depth_cm": 139.6,
  "passability_status": "Impassable (Water depth > 50cm)",
  "predicted_occurrence": true
}
```

### 7.4 `POST /feed_incident` (Single Incident Feed)
**Request**:
```json
{
  "road_corridor": "NH-06 Shillong Bypass",
  "slope_deg": 40.0,
  "rainfall_24h_mm": 110.0,
  "landslide_occurred": 1,
  "flood_occurred": 0
}
```
**Response**:
```json
{
  "message": "Incident ingested and model updated successfully",
  "result": {
    "status": "success",
    "mode": "warm_start",
    "new_samples_ingested": 1,
    "total_training_samples": 3205
  }
}
```

### 7.5 `POST /finetune` (Batch Fine-Tuning)
**Request**:
```json
{
  "mode": "warm_start",
  "incidents": [
    {
      "road_corridor": "Guwahati NH-27",
      "elevation_m": 60.0,
      "rainfall_24h_mm": 95.0,
      "flood_occurred": 1,
      "landslide_occurred": 0
    }
  ]
}
```

### 7.6 `GET /model_info`
Returns active model architecture, training date, version, dataset sample size, and cross-validation metrics.

---

## 8. Integration with the Smart Logistics Ecosystem

1. **Neo4j Graph Database**:
   - In `backend/src/routes/routing.js`, each road relationship (`CONNECTED_TO`) stores:
     - `current_time = base_time * risk_multiplier`
     - `landslide_prob`, `flood_prob`, and `hazard_status`.
   - Neo4j's Graph Data Science (GDS) Dijkstra algorithm projects `roadNetwork` with relationship property `current_time`.
   - When landslide or flood hazard spikes, `risk_multiplier` elevates travel time to up to $5.0\times$, prompting the Dijkstra algorithm to automatically detour trucks to safer bypasses.

2. **Express.js API Layer**:
   - `backend/src/routes/hazards.js` acts as an authenticated gateway between frontend clients and the Python ML service.

3. **Next.js Command Dashboard & Field Reporter**:
   - The Command Dashboard displays active hazard alert counts for each truck's calculated route.
   - Operators can open the **AI Hazard Inspector** to run what-if stress tests (adjusting rainfall and slope sliders) and trigger batch fine-tuning with 1 click.
   - The Progressive Web App (PWA) field reporter (`/report`) allows field drivers and road inspectors to report real-world landslides and floods, immediately syncing new observations into the continuous fine-tuning pipeline.

---

## 9. Verification & Testing

To test the entire machine learning pipeline:

```bash
cd ml-service

# 1. Regenerate baseline datasets
python dataset_builder.py

# 2. Train baseline models and evaluate metrics
python hazard_models.py

# 3. Test continuous fine-tuning engine
python finetune.py

# 4. Run automated test suite across all API endpoints
python test_api.py
```
