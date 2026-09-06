"""
Dataset Builder for Landslide and Flood Prediction in North Eastern Region (NER)
Generates high-fidelity training, validation, and calibration datasets modeling
geotechnical, hydrological, and meteorological interactions across NER transit corridors.
"""

import numpy as np
import pandas as pd
import os

def calculate_landslide_physics_prob(slope_deg, rainfall_24h_mm, rainfall_72h_mm, 
                                     soil_clay_percent, vegetation_ndvi, historical_incidents, road_quality):
    """
    Computes theoretical landslide probability using infinite slope stability proxy:
    Factor of Safety (FoS) decreases with slope steepness, pore water pressure (accumulated rain),
    and soil saturation, modulated by root cohesion (NDVI) and engineered road retaining works.
    """
    # Slope effect: steep angles (>25 deg) dramatically increase shear stress
    slope_term = 1.0 / (1.0 + np.exp(-(slope_deg - 28.0) / 6.0))
    
    # Hydrological trigger: 72h antecedent rainfall primes pore pressure + intense 24h triggers failure
    rain_term = 1.0 / (1.0 + np.exp(-(rainfall_24h_mm + 0.4 * rainfall_72h_mm - 90.0) / 25.0))
    
    # Soil cohesion & shear strength: high clay (>35%) softens rapidly under high pore pressure
    soil_term = (soil_clay_percent / 100.0) * 0.4
    
    # Root reinforcement mitigation from vegetation (NDVI)
    veg_mitigation = (1.0 - vegetation_ndvi) * 0.35
    
    # Historical susceptibility & road protection factor
    history_factor = np.clip(historical_incidents / 10.0, 0.0, 0.5)
    quality_mitigation = ((5 - road_quality) / 5.0) * 0.25

    # Composite latent log-odds
    latent = (0.35 * slope_term + 
              0.35 * rain_term + 
              0.10 * soil_term + 
              0.10 * veg_mitigation + 
              0.10 * history_factor +
              0.10 * quality_mitigation)
    
    # Sigmoidal calibration with natural stochastic variance
    prob = 1.0 / (1.0 + np.exp(-10.0 * (latent - 0.48)))
    return np.clip(prob, 0.01, 0.99)


def calculate_flood_physics_prob(elevation_m, distance_to_river_m, rainfall_1h_mm, 
                                 rainfall_24h_mm, road_quality, soil_clay_percent):
    """
    Computes flood / waterlogging probability based on hydrological catchment characteristics:
    Low elevation basins (Brahmaputra plains < 120m), proximity to rivers, intense rainfall,
    and poor roadside culvert drainage capacity.
    """
    # Lowland terrain susceptibility (elevation < 120m in NER is flood-prone valley)
    elevation_term = 1.0 / (1.0 + np.exp((elevation_m - 110.0) / 25.0))
    
    # River proximity (within 300m of river channel is high risk during monsoon swells)
    river_term = np.exp(-distance_to_river_m / 450.0)
    
    # Rainfall deluge trigger (1h flash rain > 35mm or 24h rain > 110mm)
    rain_term = 1.0 / (1.0 + np.exp(-(rainfall_24h_mm + 1.5 * rainfall_1h_mm - 100.0) / 28.0))
    
    # Drainage adequacy & soil runoff
    drainage_deficit = ((5 - road_quality) / 5.0) * 0.3
    runoff_factor = (soil_clay_percent / 100.0) * 0.2
    
    latent = (0.32 * elevation_term + 
              0.28 * river_term + 
              0.30 * rain_term + 
              0.10 * (drainage_deficit + runoff_factor))
    
    prob = 1.0 / (1.0 + np.exp(-9.0 * (latent - 0.44)))
    return np.clip(prob, 0.01, 0.99)


def generate_ner_hazard_dataset(n_samples=3000, random_state=42):
    """
    Generates realistic multi-corridor dataset covering both mountainous highland routes
    (e.g., Shillong, Tawang, Kohima) and river valley highway networks (Guwahati, Dibrugarh, Silchar).
    """
    np.random.seed(random_state)
    
    # Half samples highland/hill slopes, half valley/plain basins
    n_hill = n_samples // 2
    n_valley = n_samples - n_hill
    
    # Hill corridor parameters
    hill_slopes = np.random.uniform(15.0, 58.0, n_hill)
    hill_elevations = np.random.uniform(350.0, 2200.0, n_hill)
    hill_river_dist = np.random.exponential(800.0, n_hill) + 150.0
    
    # Valley corridor parameters
    valley_slopes = np.random.uniform(1.0, 18.0, n_valley)
    valley_elevations = np.random.uniform(45.0, 220.0, n_valley)
    valley_river_dist = np.random.exponential(350.0, n_valley) + 20.0
    
    slopes = np.concatenate([hill_slopes, valley_slopes])
    elevations = np.concatenate([hill_elevations, valley_elevations])
    river_dists = np.clip(np.concatenate([hill_river_dist, valley_river_dist]), 10.0, 5000.0)
    
    # Weather parameters (simulate seasonal spectrum: dry season to peak monsoon squalls)
    # Monsoon storm days have high rainfall, dry days near zero
    is_monsoon_day = np.random.binomial(1, 0.45, n_samples)
    
    rain_1h = np.where(
        is_monsoon_day == 1,
        np.random.gamma(shape=2.5, scale=12.0, size=n_samples), # Heavy bursts
        np.random.exponential(scale=2.0, size=n_samples)        # Light / none
    )
    rain_1h = np.clip(rain_1h, 0.0, 85.0)
    
    rain_24h = np.where(
        is_monsoon_day == 1,
        rain_1h * np.random.uniform(3.5, 7.0, n_samples) + np.random.uniform(10.0, 50.0, n_samples),
        rain_1h * np.random.uniform(1.0, 3.0, n_samples)
    )
    rain_24h = np.clip(rain_24h, 0.0, 380.0)
    
    rain_72h = np.where(
        is_monsoon_day == 1,
        rain_24h * np.random.uniform(1.8, 3.2, n_samples) + np.random.uniform(20.0, 80.0, n_samples),
        rain_24h * np.random.uniform(1.1, 2.0, n_samples)
    )
    rain_72h = np.clip(rain_72h, 0.0, 750.0)
    
    soil_clay = np.random.uniform(15.0, 55.0, n_samples)
    ndvi = np.clip(np.random.normal(loc=0.55, scale=0.18, size=n_samples), 0.08, 0.88)
    historical_incidents = np.random.poisson(lam=3.0, size=n_samples)
    historical_incidents = np.clip(historical_incidents, 0, 20)
    
    road_quality = np.random.choice([1, 2, 3, 4, 5], size=n_samples, p=[0.12, 0.22, 0.32, 0.22, 0.12])
    
    # Calculate ground-truth probabilities
    p_landslide = calculate_landslide_physics_prob(
        slopes, rain_24h, rain_72h, soil_clay, ndvi, historical_incidents, road_quality
    )
    
    p_flood = calculate_flood_physics_prob(
        elevations, river_dists, rain_1h, rain_24h, road_quality, soil_clay
    )
    
    # Stochastic occurrence labels based on probability
    landslide_occurred = (np.random.rand(n_samples) < p_landslide).astype(int)
    flood_occurred = (np.random.rand(n_samples) < p_flood).astype(int)
    
    # Continuous waterlogging inundation depth in cm
    inundation_depth = np.where(
        flood_occurred == 1,
        np.clip(p_flood * 110.0 + rain_1h * 0.8 + np.random.normal(0, 10, n_samples), 5.0, 180.0),
        0.0
    )
    
    # Calculate composite operational risk multiplier (1.0x to 5.0x)
    # Severe landslide or deep flood (>60cm) virtually closes the road (multiplier ~ 4.5 - 5.0)
    base_mult = 1.0
    ls_penalty = p_landslide * 2.8 + (1.2 if landslide_occurred.any() else 0.0) * p_landslide
    fl_penalty = p_flood * 2.2 + np.clip(inundation_depth / 60.0, 0.0, 1.5)
    quality_drag = (5 - road_quality) * 0.15
    
    risk_multiplier = np.clip(base_mult + 0.55 * ls_penalty + 0.45 * fl_penalty + quality_drag, 1.0, 5.0)
    
    # Road Corridor Assignment
    corridors = ['NH-06 (Guwahati-Shillong)', 'NH-27 (East-West Corridor)', 
                 'NH-10 (Siliguri-Gangtok)', 'NH-37 (Silchar-Imphal)', 
                 'Guwahati-Jalukbari-Khanapara Urban', 'NH-15 (North Bank Brahmaputra)']
    road_corridor = np.random.choice(corridors, size=n_samples)
    
    df = pd.DataFrame({
        'road_corridor': road_corridor,
        'slope_deg': np.round(slopes, 1),
        'elevation_m': np.round(elevations, 1),
        'rainfall_1h_mm': np.round(rain_1h, 1),
        'rainfall_24h_mm': np.round(rain_24h, 1),
        'rainfall_72h_mm': np.round(rain_72h, 1),
        'soil_clay_percent': np.round(soil_clay, 1),
        'distance_to_river_m': np.round(river_dists, 1),
        'vegetation_ndvi': np.round(ndvi, 3),
        'historical_incidents': historical_incidents,
        'road_quality': road_quality,
        'p_landslide_true': np.round(p_landslide, 4),
        'landslide_occurred': landslide_occurred,
        'p_flood_true': np.round(p_flood, 4),
        'flood_occurred': flood_occurred,
        'inundation_depth_cm': np.round(inundation_depth, 1),
        'risk_multiplier': np.round(risk_multiplier, 2)
    })
    
    return df

def build_and_save_datasets(output_dir=None):
    if output_dir is None:
        output_dir = os.path.dirname(os.path.abspath(__file__))
    
    os.makedirs(output_dir, exist_ok=True)
    
    print("Generating NER Hazard Dataset (Train: 3200 rows, Test: 800 rows)...")
    df_train = generate_ner_hazard_dataset(n_samples=3200, random_state=42)
    df_test = generate_ner_hazard_dataset(n_samples=800, random_state=999)
    
    train_path = os.path.join(output_dir, "ner_hazard_train.csv")
    test_path = os.path.join(output_dir, "ner_hazard_test.csv")
    
    df_train.to_csv(train_path, index=False)
    df_test.to_csv(test_path, index=False)
    
    print(f"Saved: {train_path} ({len(df_train)} rows)")
    print(f"Saved: {test_path} ({len(df_test)} rows)")
    print(f"Landslide event rate: {df_train['landslide_occurred'].mean()*100:.1f}%")
    print(f"Flood event rate:     {df_train['flood_occurred'].mean()*100:.1f}%")
    return train_path, test_path

if __name__ == "__main__":
    build_and_save_datasets()
