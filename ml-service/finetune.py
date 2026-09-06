"""
Fine-Tuning and Continual Learning Engine for Landslide & Flood Hazard Models
Supports both CLI execution and programmatic API calls to ingest field observations,
perform incremental warm-start learning or full calibrated retraining, and generate
model checkpoints with metric comparison.
"""

import os
import sys
import json
import shutil
import argparse
import pandas as pd
import numpy as np
from datetime import datetime, timezone

from hazard_models import (
    DualHazardModelSystem, 
    LANDSLIDE_FEATURES, 
    FLOOD_FEATURES, 
    RISK_MULTIPLIER_FEATURES,
    MODEL_DIR, 
    MODEL_BUNDLE_PATH, 
    METADATA_PATH
)

TRAIN_DATA_PATH = os.path.join(MODEL_DIR, "ner_hazard_train.csv")
TEST_DATA_PATH = os.path.join(MODEL_DIR, "ner_hazard_test.csv")
CHECKPOINT_DIR = os.path.join(MODEL_DIR, "checkpoints")

class FineTuningEngine:
    def __init__(self):
        self.system = DualHazardModelSystem()
        os.makedirs(CHECKPOINT_DIR, exist_ok=True)

    def backup_current_model(self):
        """Creates a timestamped backup of the current model before fine-tuning."""
        if os.path.exists(MODEL_BUNDLE_PATH):
            timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
            backup_bundle = os.path.join(CHECKPOINT_DIR, f"hazard_bundle_backup_{timestamp}.pkl")
            backup_meta = os.path.join(CHECKPOINT_DIR, f"metadata_backup_{timestamp}.json")
            shutil.copyfile(MODEL_BUNDLE_PATH, backup_bundle)
            if os.path.exists(METADATA_PATH):
                shutil.copyfile(METADATA_PATH, backup_meta)
            print(f"Backed up active model to {backup_bundle}")
            return backup_bundle
        return None

    def validate_and_normalize_data(self, df):
        """
        Validates input columns and infers any missing target/derived attributes.
        """
        required_features = set(LANDSLIDE_FEATURES + FLOOD_FEATURES)
        missing = [col for col in required_features if col not in df.columns]
        if missing:
            # Try to populate sensible defaults for missing non-essential columns
            defaults = {
                'soil_clay_percent': 35.0,
                'vegetation_ndvi': 0.50,
                'distance_to_river_m': 600.0,
                'historical_incidents': 2,
                'road_quality': 3,
                'rainfall_1h_mm': 10.0,
                'rainfall_72h_mm': 60.0
            }
            for m in missing:
                if m in defaults:
                    print(f"Warning: Missing column '{m}' defaulted to {defaults[m]}")
                    df[m] = defaults[m]
                else:
                    raise ValueError(f"Input data missing critical column: '{m}'")

        # Ensure target labels exist and have no NaNs
        if 'landslide_occurred' not in df.columns or df['landslide_occurred'].isna().any():
            calc_ls = ((df['rainfall_24h_mm'] > 90) & (df['slope_deg'] > 28)).astype(int)
            df['landslide_occurred'] = df['landslide_occurred'].fillna(calc_ls) if 'landslide_occurred' in df.columns else calc_ls
            df['landslide_occurred'] = df['landslide_occurred'].astype(int)

        if 'flood_occurred' not in df.columns or df['flood_occurred'].isna().any():
            calc_fl = ((df['elevation_m'] < 130) & (df['rainfall_24h_mm'] > 80)).astype(int)
            df['flood_occurred'] = df['flood_occurred'].fillna(calc_fl) if 'flood_occurred' in df.columns else calc_fl
            df['flood_occurred'] = df['flood_occurred'].astype(int)

        if 'inundation_depth_cm' not in df.columns or df['inundation_depth_cm'].isna().any():
            calc_depth = pd.Series(np.where(df['flood_occurred'] == 1, 35.0, 0.0), index=df.index)
            df['inundation_depth_cm'] = df['inundation_depth_cm'].fillna(calc_depth) if 'inundation_depth_cm' in df.columns else calc_depth

        if 'risk_multiplier' not in df.columns or df['risk_multiplier'].isna().any():
            calc_base = pd.Series(np.clip(1.0 + df['landslide_occurred'] * 2.2 + df['flood_occurred'] * 1.8, 1.0, 5.0), index=df.index)
            df['risk_multiplier'] = df['risk_multiplier'].fillna(calc_base) if 'risk_multiplier' in df.columns else calc_base

        df = df.fillna(0.0)
        return df

    def feed_data(self, new_data_source, mode="retrain", add_trees=20):
        """
        Ingests new data from CSV, list of dicts, or DataFrame, updates active dataset,
        and fine-tunes or retrains the model.

        Parameters:
            new_data_source: File path (str), DataFrame, or list of dicts.
            mode: "retrain" (full retrain on combined historical+new data) or 
                  "warm_start" (incremental estimator expansion on new observations)
            add_trees: Number of additional decision trees to add in warm-start mode.
        """
        if isinstance(new_data_source, str):
            if new_data_source.endswith('.csv'):
                new_df = pd.read_csv(new_data_source)
            elif new_data_source.endswith('.json'):
                new_df = pd.read_json(new_data_source)
            else:
                raise ValueError("Supported file formats are .csv and .json")
        elif isinstance(new_data_source, list):
            new_df = pd.DataFrame(new_data_source)
        elif isinstance(new_data_source, pd.DataFrame):
            new_df = new_data_source.copy()
        else:
            raise TypeError("new_data_source must be a path, list of dicts, or DataFrame")

        print(f"Loaded {len(new_df)} new observations for model fine-tuning.")
        new_df = self.validate_and_normalize_data(new_df)

        # Load existing training and testing data
        if os.path.exists(TRAIN_DATA_PATH):
            existing_train_df = pd.read_csv(TRAIN_DATA_PATH)
            combined_train_df = pd.concat([existing_train_df, new_df], ignore_index=True)
        else:
            combined_train_df = new_df

        test_df = pd.read_csv(TEST_DATA_PATH) if os.path.exists(TEST_DATA_PATH) else None

        # Backup current model
        self.backup_current_model()
        self.system.load()

        previous_metrics = self.system.metadata.get('metrics', {})

        if mode == "warm_start" and self.system.is_trained:
            print(f"Performing incremental warm-start fine-tuning (+{add_trees} estimators)...")
            # Sample balanced experience replay buffer from historical records to guarantee both classes exist
            if os.path.exists(TRAIN_DATA_PATH):
                hist_df = pd.read_csv(TRAIN_DATA_PATH)
                n_pos = min(50, (hist_df['landslide_occurred'] == 1).sum())
                n_neg = min(50, (hist_df['landslide_occurred'] == 0).sum())
                pos_samples = hist_df[hist_df['landslide_occurred'] == 1].sample(n_pos, random_state=42)
                neg_samples = hist_df[hist_df['landslide_occurred'] == 0].sample(n_neg, random_state=42)
                replay_df = pd.concat([pos_samples, neg_samples, new_df], ignore_index=True)
            else:
                replay_df = combined_train_df

            # Check if all classes present; if not, fallback to full fast retrain
            if len(np.unique(replay_df['landslide_occurred'])) < 2 or len(np.unique(replay_df['flood_occurred'])) < 2:
                print("Single-class replay detected. Falling back to calibrated fast retrain...")
                self.system.train_baseline(combined_train_df, test_df)
            else:
                assert self.system.landslide_clf is not None
                assert self.system.flood_clf is not None
                assert self.system.risk_mult_reg is not None

                # Warm-start landslide classifier
                self.system.landslide_clf.n_estimators += add_trees
                self.system.landslide_clf.fit(replay_df[LANDSLIDE_FEATURES], replay_df['landslide_occurred'])

                # Warm-start flood classifier
                self.system.flood_clf.n_estimators += add_trees
                self.system.flood_clf.fit(replay_df[FLOOD_FEATURES], replay_df['flood_occurred'])

                # Retrain fast regressors
                self.system.risk_mult_reg.fit(combined_train_df[RISK_MULTIPLIER_FEATURES], combined_train_df['risk_multiplier'])
        else:
            print(f"Performing calibrated full retraining across {len(combined_train_df)} observations...")
            self.system.train_baseline(combined_train_df, test_df)

        # Persist updated training dataset
        combined_train_df.to_csv(TRAIN_DATA_PATH, index=False)
        print(f"Updated persistent training dataset: {TRAIN_DATA_PATH} ({len(combined_train_df)} total records)")

        # Update metadata with fine-tuning history
        updated_metrics = self.system.metadata.get('metrics', {})
        fine_tune_entry = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'mode': mode,
            'new_samples_added': len(new_df),
            'total_samples': len(combined_train_df),
            'landslide_roc_auc': updated_metrics.get('landslide', {}).get('roc_auc'),
            'flood_roc_auc': updated_metrics.get('flood', {}).get('roc_auc')
        }

        history = self.system.metadata.get('fine_tuning_history', [])
        history.append(fine_tune_entry)
        self.system.metadata['fine_tuning_history'] = history
        self.system.metadata['last_fine_tuned'] = datetime.now(timezone.utc).isoformat()
        self.system.metadata['total_train_samples'] = len(combined_train_df)
        self.system.save()

        summary = {
            'status': 'success',
            'mode': mode,
            'new_samples_ingested': len(new_df),
            'total_training_samples': len(combined_train_df),
            'previous_metrics': previous_metrics,
            'updated_metrics': updated_metrics
        }
        return summary

    def feed_single_incident(self, incident_dict):
        """
        Quick convenience method to ingest a single live incident report from the field
        (e.g., from the mobile incident reporter app) and immediately update models.
        """
        return self.feed_data([incident_dict], mode="warm_start", add_trees=5)


def generate_sample_field_data():
    """Generates a sample batch of newly gathered NER ground observations."""
    sample_records = [
        {
            'road_corridor': 'NH-06 (Guwahati-Shillong)',
            'slope_deg': 42.0,
            'elevation_m': 890.0,
            'rainfall_1h_mm': 42.0,
            'rainfall_24h_mm': 155.0,
            'rainfall_72h_mm': 310.0,
            'soil_clay_percent': 48.0,
            'distance_to_river_m': 120.0,
            'vegetation_ndvi': 0.22,
            'historical_incidents': 8,
            'road_quality': 2,
            'landslide_occurred': 1,
            'flood_occurred': 0,
            'inundation_depth_cm': 0.0,
            'risk_multiplier': 4.8
        },
        {
            'road_corridor': 'Guwahati-Jalukbari-Khanapara Urban',
            'slope_deg': 4.0,
            'elevation_m': 54.0,
            'rainfall_1h_mm': 38.0,
            'rainfall_24h_mm': 115.0,
            'rainfall_72h_mm': 160.0,
            'soil_clay_percent': 35.0,
            'distance_to_river_m': 60.0,
            'vegetation_ndvi': 0.40,
            'historical_incidents': 4,
            'road_quality': 3,
            'landslide_occurred': 0,
            'flood_occurred': 1,
            'inundation_depth_cm': 65.0,
            'risk_multiplier': 4.1
        },
        {
            'road_corridor': 'NH-27 (East-West Corridor)',
            'slope_deg': 8.0,
            'elevation_m': 105.0,
            'rainfall_1h_mm': 5.0,
            'rainfall_24h_mm': 18.0,
            'rainfall_72h_mm': 30.0,
            'soil_clay_percent': 28.0,
            'distance_to_river_m': 1200.0,
            'vegetation_ndvi': 0.65,
            'historical_incidents': 1,
            'road_quality': 5,
            'landslide_occurred': 0,
            'flood_occurred': 0,
            'inundation_depth_cm': 0.0,
            'risk_multiplier': 1.05
        }
    ]
    sample_csv_path = os.path.join(MODEL_DIR, "sample_field_feed.csv")
    pd.DataFrame(sample_records).to_csv(sample_csv_path, index=False)
    print(f"Created sample field observation file: {sample_csv_path}")
    return sample_csv_path

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fine-tune NER Landslide and Flood Prediction Models")
    parser.add_argument("--data", type=str, help="Path to new CSV or JSON dataset to ingest")
    parser.add_argument("--mode", type=str, default="retrain", choices=["retrain", "warm_start"], help="Fine-tuning mode")
    parser.add_argument("--create-sample", action="store_true", help="Generate a sample field observation CSV to test feeding")
    args = parser.parse_args()

    engine = FineTuningEngine()

    if args.create_sample:
        sample_path = generate_sample_field_data()
        print(f"Run 'python finetune.py --data {sample_path} --mode warm_start' to test fine-tuning.")
        sys.exit(0)

    if args.data:
        res = engine.feed_data(args.data, mode=args.mode)
        print("\nFine-tuning completed successfully!")
        print(json.dumps(res, indent=2))
    else:
        print("No input data provided. Generating and running sample fine-tuning demo...")
        sample_path = generate_sample_field_data()
        res = engine.feed_data(sample_path, mode="warm_start", add_trees=15)
        print("\nDemo fine-tuning completed successfully!")
        print(json.dumps(res, indent=2))
