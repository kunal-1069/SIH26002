# SIH26002: AI-Based Smart Logistics & Accessibility Intelligence Platform (NER)

A comprehensive geospatial logistics and route intelligence platform tailored for the **North Eastern Region (NER) of India**, incorporating real-time **Landslide & Flood Prediction AI**, Dijkstra graph-based dynamic routing over Neo4j, GPS fleet tracking, and offline-first field incident reporting.

---

## 🏔️🌊 AI Landslide & Flood Prediction Engine

The platform features a production-grade **Dual-Hazard AI System** located in [`ml-service/`](./ml-service/):
- **Landslide Prediction**: Evaluates slope gradient, 24h & 72h antecedent rainfall, clay content, vegetation index (NDVI), and structural road quality to calculate landslide probability, failure classification, and blockage severity.
- **Flood & Waterlogging Prediction**: Assesses elevation basin depressions, river proximity, cloudburst intensity, and drainage capacity to calculate inundation probability, standing water depth, and passability.
- **Composite Risk Multiplier**: Dynamically weights highway edge costs ($1.0\times - 5.0\times$) consumed directly by Neo4j Dijkstra shortest-path algorithms to detour trucks around hazardous zones.
- **Continual Fine-Tuning & Data Ingestion**: Supports incremental warm-start learning and calibrated full retrains via both CLI (`python finetune.py`) and REST APIs (`POST /finetune`, `POST /feed_incident`).

📖 **Full Technical Documentation**: Read [`ml-service/MODEL_DOCUMENTATION.md`](./ml-service/MODEL_DOCUMENTATION.md) for full mathematical formulations, geotechnical physics, benchmarks, and API reference.

---

## 🚀 Quick Start: Running the AI ML Service

### 1. Requirements & Setup
```bash
cd ml-service
pip install -r requirements.txt
```

### 2. Generate Regional Baseline Datasets
```bash
python dataset_builder.py
```

### 3. Train Baseline Hazard Models
```bash
python hazard_models.py
```

### 4. Test Fine-Tuning Pipeline
```bash
# Generate sample field incident batch and fine-tune
python finetune.py --create-sample
python finetune.py --data sample_field_feed.csv --mode warm_start
```

### 5. Run API Verification Suite
```bash
python test_api.py
```

### 6. Start the FastAPI Service
```bash
python app.py
# Running at http://localhost:8000
```

---

## 🌐 Platform Architecture

- **`ml-service` (Python / FastAPI)**: Machine learning models, fine-tuning engine, and hazard inference endpoints on port `8000`.
- **`backend` (Node.js / Express)**: Graph routing engine via Neo4j Dijkstra, live weather integration (Open-Meteo), and hazard API gateway on port `3001`.
- **`frontend` (Next.js / React)**: Real-time Command Dashboard with live fleet map, route hazard alerts, AI stress-test simulator, and PWA Field Incident Reporter on port `3000`.
- **`docker-compose.yml`**: Database services (Neo4j with APOC & GDS, PostGIS, MongoDB, Redis).
