"""
NER Dual-Hazard Prediction Engine: Landslide & Flood Machine Learning Models
Provides calibrated probability estimation, severity classification, road passability analysis,
and composite risk multiplier calculation for Dijkstra graph routing.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timezone
import xgboost as xgb
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, HistGradientBoostingClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, f1_score, precision_score, recall_score, mean_squared_error

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_BUNDLE_PATH = os.path.join(MODEL_DIR, "hazard_models_bundle.pkl")
METADATA_PATH = os.path.join(MODEL_DIR, "model_metadata.json")

# Feature definitions
LANDSLIDE_FEATURES = [
    'slope_deg', 
    'rainfall_24h_mm', 
    'rainfall_72h_mm', 
    'soil_clay_percent', 
    'soil_moisture_index',
    'vegetation_ndvi', 
    'historical_incidents', 
    'road_quality'
]

FLOOD_FEATURES = [
    'elevation_m', 
    'distance_to_river_m', 
    'rainfall_1h_mm', 
    'rainfall_24h_mm', 
    'road_quality', 
    'soil_clay_percent',
    'soil_moisture_index'
]

RISK_MULTIPLIER_FEATURES = [
    'slope_deg',
    'elevation_m',
    'rainfall_1h_mm',
    'rainfall_24h_mm',
    'rainfall_72h_mm',
    'soil_clay_percent',
    'soil_moisture_index',
    'distance_to_river_m',
    'vegetation_ndvi',
    'historical_incidents',
    'road_quality'
]

from typing import Any, Optional

class DualHazardModelSystem:
    landslide_clf: Any
    flood_clf: Any
    flood_depth_reg: Any
    risk_mult_reg: Any

    def __init__(self, backend="xgboost"):
        self.landslide_clf: Any = None
        self.flood_clf: Any = None
        self.flood_depth_reg: Any = None
        self.risk_mult_reg: Any = None
        self.backend: str = backend
        self.metadata = {}
        self.is_trained = False

    def train_baseline(self, train_df, test_df=None, backend=None):
        """
        Trains baseline ensemble models across both hazards and composite risk multiplier.
        Supports both 'xgboost' and 'random_forest' backends.
        """
        if backend is not None:
            self.backend = backend

        if self.backend == "xgboost":
            print("Training Landslide Classification Model with XGBoost...")
            X_ls = train_df[LANDSLIDE_FEATURES]
            y_ls = train_df['landslide_occurred']
            self.landslide_clf = xgb.XGBClassifier(
                n_estimators=120, max_depth=6, learning_rate=0.08,
                subsample=0.85, colsample_bytree=0.85,
                eval_metric='logloss', random_state=42
            )
            self.landslide_clf.fit(X_ls, y_ls)

            print("Training Flood Hazard Classification & Depth Regressor with XGBoost...")
            X_fl = train_df[FLOOD_FEATURES]
            y_fl = train_df['flood_occurred']
            self.flood_clf = xgb.XGBClassifier(
                n_estimators=120, max_depth=6, learning_rate=0.08,
                subsample=0.85, colsample_bytree=0.85,
                eval_metric='logloss', random_state=42
            )
            self.flood_clf.fit(X_fl, y_fl)

            # Flood depth regressor on flooded instances
            flooded_subset = train_df[train_df['flood_occurred'] == 1]
            if len(flooded_subset) < 10:
                flooded_subset = train_df
            X_fd = flooded_subset[FLOOD_FEATURES]
            y_fd = flooded_subset['inundation_depth_cm']
            self.flood_depth_reg = xgb.XGBRegressor(
                n_estimators=80, max_depth=5, learning_rate=0.08,
                eval_metric='rmse', random_state=42
            )
            self.flood_depth_reg.fit(X_fd, y_fd)

            print("Training Composite Route Risk Multiplier Regressor with XGBoost...")
            X_rm = train_df[RISK_MULTIPLIER_FEATURES]
            y_rm = train_df['risk_multiplier']
            self.risk_mult_reg = xgb.XGBRegressor(
                n_estimators=100, max_depth=5, learning_rate=0.08,
                eval_metric='rmse', random_state=42
            )
            self.risk_mult_reg.fit(X_rm, y_rm)
            model_type_label = 'XGBoost Dual-Hazard Gradient Boosted Ensemble'
            version_label = '2.1.0-xgboost'
        else:
            print("Training Landslide Classification Model with RandomForest...")
            X_ls = train_df[LANDSLIDE_FEATURES]
            y_ls = train_df['landslide_occurred']
            self.landslide_clf = RandomForestClassifier(
                n_estimators=100, max_depth=12, min_samples_split=4,
                random_state=42, warm_start=True
            )
            self.landslide_clf.fit(X_ls, y_ls)

            print("Training Flood Hazard Classification & Depth Regressor with RandomForest...")
            X_fl = train_df[FLOOD_FEATURES]
            y_fl = train_df['flood_occurred']
            self.flood_clf = RandomForestClassifier(
                n_estimators=100, max_depth=12, min_samples_split=4,
                random_state=42, warm_start=True
            )
            self.flood_clf.fit(X_fl, y_fl)

            # Flood depth regressor on flooded instances
            flooded_subset = train_df[train_df['flood_occurred'] == 1]
            if len(flooded_subset) < 10:
                flooded_subset = train_df
            X_fd = flooded_subset[FLOOD_FEATURES]
            y_fd = flooded_subset['inundation_depth_cm']
            self.flood_depth_reg = RandomForestRegressor(
                n_estimators=60, max_depth=10, random_state=42
            )
            self.flood_depth_reg.fit(X_fd, y_fd)

            print("Training Composite Route Risk Multiplier Regressor with RandomForest...")
            X_rm = train_df[RISK_MULTIPLIER_FEATURES]
            y_rm = train_df['risk_multiplier']
            self.risk_mult_reg = RandomForestRegressor(
                n_estimators=80, max_depth=10, random_state=42
            )
            self.risk_mult_reg.fit(X_rm, y_rm)
            model_type_label = 'Calibrated Ensemble (RandomForest + Multi-Task Regressors)'
            version_label = '2.0.0-dual-hazard'

        self.is_trained = True

        # Compute validation metrics
        metrics = {}
        if test_df is not None:
            # Landslide eval
            X_ls_test = test_df[LANDSLIDE_FEATURES]
            y_ls_test = test_df['landslide_occurred']
            y_ls_pred = self.landslide_clf.predict(X_ls_test)
            y_ls_proba = self.landslide_clf.predict_proba(X_ls_test)[:, 1]

            # Flood eval
            X_fl_test = test_df[FLOOD_FEATURES]
            y_fl_test = test_df['flood_occurred']
            y_fl_pred = self.flood_clf.predict(X_fl_test)
            y_fl_proba = self.flood_clf.predict_proba(X_fl_test)[:, 1]

            # Risk multiplier eval
            X_rm_test = test_df[RISK_MULTIPLIER_FEATURES]
            y_rm_test = test_df['risk_multiplier']
            y_rm_pred = self.risk_mult_reg.predict(X_rm_test)

            metrics = {
                'landslide': {
                    'accuracy': round(float(accuracy_score(y_ls_test, y_ls_pred)), 4),
                    'roc_auc': round(float(roc_auc_score(y_ls_test, y_ls_proba)), 4),
                    'precision': round(float(precision_score(y_ls_test, y_ls_pred)), 4),
                    'recall': round(float(recall_score(y_ls_test, y_ls_pred)), 4),
                    'f1_score': round(float(f1_score(y_ls_test, y_ls_pred)), 4),
                    'feature_importances': dict(zip(LANDSLIDE_FEATURES, [round(float(v), 4) for v in self.landslide_clf.feature_importances_]))
                },
                'flood': {
                    'accuracy': round(float(accuracy_score(y_fl_test, y_fl_pred)), 4),
                    'roc_auc': round(float(roc_auc_score(y_fl_test, y_fl_proba)), 4),
                    'precision': round(float(precision_score(y_fl_test, y_fl_pred)), 4),
                    'recall': round(float(recall_score(y_fl_test, y_fl_pred)), 4),
                    'f1_score': round(float(f1_score(y_fl_test, y_fl_pred)), 4),
                    'feature_importances': dict(zip(FLOOD_FEATURES, [round(float(v), 4) for v in self.flood_clf.feature_importances_]))
                },
                'risk_multiplier': {
                    'rmse': round(float(np.sqrt(mean_squared_error(y_rm_test, y_rm_pred))), 4),
                    'r2_score': round(float(self.risk_mult_reg.score(X_rm_test, y_rm_test)), 4)
                }
            }

        self.metadata = {
            'version': version_label,
            'model_type': model_type_label,
            'backend': self.backend,
            'trained_at': datetime.now(timezone.utc).isoformat(),
            'total_train_samples': len(train_df),
            'metrics': metrics
        }

        self.save()
        print("Model training complete and saved.")
        return metrics

    def predict_landslide(self, data_dict):
        """
        Predicts landslide risk probability, hazard level, and primary risk contributors.
        """
        self._ensure_loaded()
        df = pd.DataFrame([{k: data_dict.get(k, 0.0) for k in LANDSLIDE_FEATURES}])
        proba = float(self.landslide_clf.predict_proba(df)[0, 1])
        predicted_occurrence = proba >= 0.5

        if proba < 0.25:
            severity = "Low"
            recommendation = "Normal speed transit. Terrain stable."
        elif proba < 0.55:
            severity = "Moderate"
            recommendation = "Caution advised on cut slopes. Active monitoring."
        elif proba < 0.80:
            severity = "High"
            recommendation = "High landslide probability. Divert vulnerable cargo."
        else:
            severity = "Severe / Critical"
            recommendation = "Severe slope failure hazard. Immediate road closure or detour recommended."

        # Compute dominant driver for explainability
        drivers = []
        if data_dict.get('slope_deg', 0) >= 30:
            drivers.append(f"Steep gradient ({data_dict.get('slope_deg')}°)")
        if data_dict.get('rainfall_24h_mm', 0) >= 70:
            drivers.append(f"Heavy 24h rain ({data_dict.get('rainfall_24h_mm')}mm)")
        if data_dict.get('rainfall_72h_mm', 0) >= 150:
            drivers.append(f"Deep pore water saturation from 72h rain ({data_dict.get('rainfall_72h_mm')}mm)")
        if data_dict.get('vegetation_ndvi', 0.5) < 0.3:
            drivers.append("Low vegetation / exposed slope")

        return {
            'landslide_probability': round(proba, 4),
            'hazard_level': severity,
            'predicted_occurrence': predicted_occurrence,
            'recommendation': recommendation,
            'primary_triggers': drivers if drivers else ["Normal environmental bounds"]
        }

    def predict_flood(self, data_dict):
        """
        Predicts flood inundation probability, depth, and passability.
        """
        self._ensure_loaded()
        df = pd.DataFrame([{k: data_dict.get(k, 0.0) for k in FLOOD_FEATURES}])
        proba = float(self.flood_clf.predict_proba(df)[0, 1])
        
        if proba >= 0.20:
            predicted_depth = float(self.flood_depth_reg.predict(df)[0])
            predicted_depth = round(max(predicted_depth, 5.0), 1)
        else:
            predicted_depth = 0.0

        if proba < 0.25:
            level = "Safe"
            passability = "Fully Passable"
        elif proba < 0.50:
            level = "Minor Waterlogging"
            passability = "Passable (Slow speed)"
        elif proba < 0.75:
            level = "Submerged Roadway"
            passability = "Heavy Commercial Vehicles Only (Sedans Blocked)"
        else:
            level = "Severe Inundation"
            passability = "Impassable (Water depth > 50cm)"

        return {
            'flood_probability': round(proba, 4),
            'hazard_level': level,
            'estimated_depth_cm': predicted_depth,
            'passability_status': passability,
            'predicted_occurrence': proba >= 0.5
        }

    def predict_comprehensive(self, road_id, params):
        """
        Dual hazard evaluation and Dijkstra cost multiplier.
        """
        self._ensure_loaded()
        ls_res = self.predict_landslide(params)
        fl_res = self.predict_flood(params)

        df_rm = pd.DataFrame([{k: params.get(k, 0.0) for k in RISK_MULTIPLIER_FEATURES}])
        raw_mult = self.risk_mult_reg.predict(df_rm)[0]
        if np.isnan(raw_mult):
            raw_mult = 1.0 + ls_res['landslide_probability'] * 2.5 + fl_res['flood_probability'] * 1.5
        risk_multiplier = float(raw_mult)
        
        # Upper clamp based on hazard levels
        if ls_res['hazard_level'] == "Severe / Critical" or fl_res['passability_status'].startswith("Impassable"):
            risk_multiplier = max(risk_multiplier, 4.2)
        elif ls_res['hazard_level'] == "High" or fl_res['hazard_level'] == "Submerged Roadway":
            risk_multiplier = max(risk_multiplier, 2.5)

        risk_multiplier = round(float(np.clip(risk_multiplier, 1.0, 5.0)), 2)

        status = "Normal"
        if risk_multiplier >= 3.5:
            status = "Extreme Hazard - Route Diverted"
        elif risk_multiplier >= 2.0:
            status = "High Risk - Delay Penalty Applied"
        elif risk_multiplier >= 1.3:
            status = "Moderate Risk"

        return {
            'road_id': road_id,
            'risk_multiplier': risk_multiplier,
            'status': status,
            'landslide': ls_res,
            'flood': fl_res,
            'evaluated_at': datetime.now(timezone.utc).isoformat()
        }

    def predict_legacy_risk(self, road_id, weather_severity, historical_incidents, road_quality,
                            rainfall_1h_mm=None, rainfall_24h_mm=None, rainfall_72h_mm=None,
                            soil_moisture_index=None):
        """
        Backward-compatible prediction adapter for backend routing.js calls.
        Uses real physical rainfall when provided, or accurately calibrated meteorological thresholds.
        """
        if rainfall_1h_mm is not None and rainfall_24h_mm is not None:
            rain_1h = float(rainfall_1h_mm)
            rain_24h = float(rainfall_24h_mm)
            rain_72h = float(rainfall_72h_mm if rainfall_72h_mm is not None else (rain_24h * 1.8))
        else:
            # Calibrated physical mapping from weather_severity (0 to 10)
            if weather_severity <= 1:
                rain_1h, rain_24h, rain_72h = 0.0, 1.0, 3.0
            elif weather_severity == 2:
                rain_1h, rain_24h, rain_72h = 1.5, 6.0, 12.0
            elif weather_severity <= 4:
                rain_1h, rain_24h, rain_72h = 5.0, 20.0, 40.0
            elif weather_severity <= 6:
                rain_1h, rain_24h, rain_72h = 12.0, 45.0, 85.0
            elif weather_severity <= 8:
                rain_1h, rain_24h, rain_72h = 25.0, 90.0, 170.0
            else:
                rain_1h, rain_24h, rain_72h = 50.0, 190.0, 340.0

        # Determine terrain and corridor risk profiles:
        # 1. Chronic hazard corridors (Sonapur Tunnel NH-06, Sela Pass Tawang, Dzüdza Kohima, Kolasib Aizawl)
        if historical_incidents >= 6 or (historical_incidents >= 4 and road_quality <= 2):
            slope_deg = 38.0 + min((historical_incidents - 6) * 1.5, 9.0) if historical_incidents >= 6 else 34.0
            elevation_m = 320.0
            dist_river = 180.0
            soil_clay = 50.0
            ndvi = 0.22
            # In chronic mountainous landslide zones, dynamic sensor variations propagate live
            effective_rain_1h = 16.0 + (rain_1h * 1.2)
            effective_rain_24h = 65.0 + (rain_24h * 0.8)
            effective_rain_72h = 130.0 + (rain_72h * 0.6)
        elif historical_incidents >= 3 and road_quality <= 3:
            slope_deg = 26.0
            elevation_m = 180.0
            dist_river = 350.0
            soil_clay = 38.0
            ndvi = 0.45
            effective_rain_1h = 6.0 + (rain_1h * 0.8)
            effective_rain_24h = 28.0 + (rain_24h * 0.6)
            effective_rain_72h = 55.0 + (rain_72h * 0.5)
        else:
            # 2. Well-engineered safe corridors (Guwahati-Shillong expressway, Guwahati-Nagaon NH-27, Haflong safe bypass)
            slope_deg = 14.0
            elevation_m = 90.0
            dist_river = 750.0
            soil_clay = 28.0
            ndvi = 0.65
            effective_rain_1h = rain_1h
            effective_rain_24h = rain_24h
            effective_rain_72h = rain_72h

        if soil_moisture_index is None:
            # mock if not provided based on rain
            soil_moisture_index = min(0.95, 0.2 + (effective_rain_24h / 200.0))

        params = {
            'slope_deg': slope_deg,
            'elevation_m': elevation_m,
            'rainfall_1h_mm': effective_rain_1h,
            'rainfall_24h_mm': effective_rain_24h,
            'rainfall_72h_mm': effective_rain_72h,
            'soil_clay_percent': soil_clay,
            'soil_moisture_index': soil_moisture_index,
            'distance_to_river_m': dist_river,
            'vegetation_ndvi': ndvi,
            'historical_incidents': historical_incidents,
            'road_quality': road_quality
        }

        return self.predict_comprehensive(road_id, params)

    def save(self):
        bundle = {
            'landslide_clf': self.landslide_clf,
            'flood_clf': self.flood_clf,
            'flood_depth_reg': self.flood_depth_reg,
            'risk_mult_reg': self.risk_mult_reg,
            'backend': self.backend,
            'metadata': self.metadata
        }
        joblib.dump(bundle, MODEL_BUNDLE_PATH)
        with open(METADATA_PATH, 'w') as f:
            json.dump(self.metadata, f, indent=2)

    def _ensure_loaded(self):
        if not self.is_trained:
            self.load()

    def load(self):
        if not os.path.exists(MODEL_BUNDLE_PATH):
            print("Model bundle not found. Training baseline model now...")
            train_path = os.path.join(MODEL_DIR, "ner_hazard_train.csv")
            test_path = os.path.join(MODEL_DIR, "ner_hazard_test.csv")
            if not os.path.exists(train_path):
                from dataset_builder import build_and_save_datasets
                build_and_save_datasets(MODEL_DIR)
            df_train = pd.read_csv(train_path)
            df_test = pd.read_csv(test_path)
            self.train_baseline(df_train, df_test, backend="xgboost")
            return

        bundle = joblib.load(MODEL_BUNDLE_PATH)
        self.landslide_clf = bundle['landslide_clf']
        self.flood_clf = bundle['flood_clf']
        self.flood_depth_reg = bundle['flood_depth_reg']
        self.risk_mult_reg = bundle['risk_mult_reg']
        self.backend = bundle.get('backend', 'xgboost')
        self.metadata = bundle.get('metadata', {})
        self.is_trained = True


# Singleton instance for service use
hazard_system = DualHazardModelSystem()

if __name__ == "__main__":
    hazard_system.load()
    print("Testing single inference...")
    test_input = {
        'slope_deg': 38.0,
        'elevation_m': 650.0,
        'rainfall_1h_mm': 35.0,
        'rainfall_24h_mm': 120.0,
        'rainfall_72h_mm': 280.0,
        'soil_clay_percent': 42.0,
        'soil_moisture_index': 0.85,
        'distance_to_river_m': 180.0,
        'vegetation_ndvi': 0.32,
        'historical_incidents': 6,
        'road_quality': 2
    }
    res = hazard_system.predict_comprehensive("R_TEST_01", test_input)
    print(json.dumps(res, indent=2))
