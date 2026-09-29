# CycloneFusion-AI REST API Specification

## Service Overview
FastAPI backend providing model inference, track prediction, historical storm exploration, explainability heatmaps, and MLflow registry synchronization.

## Core Endpoints
- `POST /predict`: Generate multimodal prediction (identification, category, localization, intensity horizons, track trajectory, uncertainty cones).
- `POST /upload`: Secure multi-sensor file ingestion with validation gate verification.
- `GET /prediction/{id}`: Retrieve detailed prediction record including uncertainty intervals.
- `GET /cyclones`: List tracked or archived North Indian Ocean cyclone events.
- `GET /cyclone/{id}`: Detailed lifecycle track and environmental metadata for specific event.
- `GET /history`: Synoptic observation history and sequence buffers.
- `GET /explainability/{prediction_id}`: Grad-CAM attention maps and saliency heatmaps.
- `GET /metrics`: Model performance metrics on test partition.
- `GET /health`: System, database, and inference pipeline readiness status.
