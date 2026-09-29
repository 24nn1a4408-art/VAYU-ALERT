import React, { useState } from 'react';
import { Cpu, Terminal, GitBranch, Database, FileText, CheckCircle2 } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

export const ArchitectureView: React.FC = () => {
  const [selectedConfig, setSelectedConfig] = useState<'config' | 'data' | 'model' | 'training' | 'docker' | 'ci'>('config');

  const configFiles: Record<string, { filename: string; path: string; desc: string; snippet: string }> = {
    config: {
      filename: "config.yaml",
      path: "configs/config.yaml",
      desc: "Global project configuration: basin definition (Bay of Bengal & Arabian Sea), random seed (42), compute devices, and logging.",
      snippet: `project_name: "CycloneFusion-AI"
version: "0.1.0"
basin_focus:
  primary: "North Indian Ocean"
  sub_basins: ["Bay of Bengal", "Arabian Sea"]
  spatial_bounds:
    lat_min: 0.0, lat_max: 35.0
    lon_min: 45.0, lon_max: 105.0

seed: 42
deterministic: true
compute:
  device: "cpu"
  num_workers: 2
  mixed_precision: false
  debug_mode: true`
    },
    data: {
      filename: "data.yaml",
      path: "configs/data.yaml",
      desc: "Data ingestion, reference time step (6 hours), sensor channels (TIR1, TIR2, WV, VIS), ERA5 variables, and validation thresholds.",
      snippet: `reference_time_step_hours: 6
temporal_sequence:
  input_timesteps_hours: [-24, -18, -12, -6, 0]
  forecast_horizons_hours: [6, 12, 24, 48]
  max_allowed_time_offset_minutes: 60

satellite_modalities:
  sensors: ["INSAT-3D", "INSAT-3DR"]
  channels:
    - { name: "TIR1", wavelength_um: 10.8, required: true }
    - { name: "TIR2", wavelength_um: 12.0, required: false }
    - { name: "WV",   wavelength_um: 6.7,  required: false }
    - { name: "VIS",  wavelength_um: 0.65, required: false }

environmental_variables:
  reanalysis_source: "ERA5"
  variables: ["sst", "vws_200_850", "rh_700", "mslp", "vor_850"]`
    },
    model: {
      filename: "model.yaml",
      path: "configs/model.yaml",
      desc: "Multimodal architecture: ConvNeXt/CNN spatial backbone, ConvLSTM temporal satellite encoder, Cross-Attention fusion, and multi-task heads.",
      snippet: `model_name: "CycloneFusionMultimodal"
version: "1.0.0"

satellite_encoder:
  backbone: "convnext_tiny"
  in_channels: 4 # TIR1, TIR2, WV, VIS
  spatial_feature_dim: 256

temporal_satellite_encoder:
  type: "ConvLSTM"
  hidden_dim: 128, kernel_size: [3, 3], num_layers: 2

environmental_encoder:
  input_dim: 12, output_dim: 128

historical_encoder:
  type: "GRU", input_dim: 8, hidden_dim: 128

multimodal_fusion:
  type: "CrossAttention", d_model: 256, n_heads: 4

multi_task_heads:
  identification: { type: "binary_classifier" }
  classification: { type: "multiclass_classifier", num_classes: 7 }
  localization: { type: "coordinate_regression", out_features: 2 }
  intensity: { type: "quantile_regression", quantiles: [0.1, 0.5, 0.9] }
  pressure: { type: "regression", horizons: [6, 12, 24, 48] }
  track: { type: "geodesic_trajectory", horizons: [6, 12, 24, 48] }`
    },
    training: {
      filename: "training.yaml",
      path: "configs/training.yaml",
      desc: "Loss weights (detection, classification, localization, intensity, pressure, track), pinball quantile loss, and extreme event penalties.",
      snippet: `experiment:
  name: "multimodal_multitask_nio_study"
  seed: 42, epochs: 50, batch_size: 16

loss_weights:
  lambda_detection: 1.0
  lambda_classification: 1.5
  lambda_localization: 2.0
  lambda_intensity: 2.5
  lambda_pressure: 1.0
  lambda_track: 3.0
  lambda_extreme_penalty: 2.0

loss_functions:
  detection: "focal_loss"
  classification: "class_weighted_cross_entropy"
  localization: "smooth_l1_loss"
  intensity: "pinball_quantile_loss"
  track: "haversine_great_circle_loss"

extreme_event_handling:
  rapid_intensification_threshold_kt_24h: 30.0
  severe_intensity_threshold_kt: 64.0`
    },
    docker: {
      filename: "docker-compose.yml",
      path: "docker-compose.yml",
      desc: "Multi-service container stack: PostgreSQL/PostGIS geospatial database, MLflow experiment tracking server, and FastAPI backend.",
      snippet: `version: '3.8'
services:
  database:
    image: postgis/postgis:15-3.4
    environment:
      POSTGRES_USER: cyclone_user
      POSTGRES_DB: cyclonefusion
    ports: ["5432:5432"]

  mlflow:
    image: ghcr.io/mlflow/mlflow:v2.10.0
    ports: ["5000:5000"]
    depends_on: [database]

  backend:
    build: .
    ports: ["8000:8000"]
    depends_on: [database]`
    },
    ci: {
      filename: "ci.yml",
      path: ".github/workflows/ci.yml",
      desc: "Continuous integration pipeline: static code analysis, flake8 linting, TypeScript check, unit test execution, and dataset validation gate.",
      snippet: `name: CycloneFusion-AI CI Pipeline
on: [push, pull_request]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: flake8 . --select=E9,F63,F7,F82
      - run: npm run lint

  unit-and-data-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: python3 -m unittest discover -s tests -v

  dataset-validation-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: python3 scripts/validate_dataset.py --config configs/data.yaml`
    }
  };

  const cur = configFiles[selectedConfig];

  return (
    <div id="architecture-view-container" className="space-y-6">
      {/* Top Banner */}
      <GlassPanel className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-[#41644A]" />
            <h2 className="text-lg font-bold text-[#0D4715]">Phase 0 Repository Initialization & Specifications</h2>
          </div>
          <p className="text-xs text-[#1F3E28] mt-1 max-w-2xl font-medium">
            Section 31 & 48 specifications: Clean reproducible configurations, Docker Compose infrastructure,
            CI automation, and structured documentation.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-lg bg-[#EBE1D1] border border-[#41644A]/40 text-xs font-mono text-[#0D4715] font-bold shadow-xs flex items-center space-x-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#41644A]" />
            <span>Tests: 10 / 10 Passing</span>
          </span>
        </div>
      </GlassPanel>

      {/* Grid: Config Selector & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: File List */}
        <div className="lg:col-span-4 space-y-2">
          {Object.entries(configFiles).map(([key, item]) => {
            const isSelected = selectedConfig === key;
            return (
              <button
                key={key}
                id={`arch-btn-${key}`}
                onClick={() => setSelectedConfig(key as any)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#EBE1D1] border-[#41644A] shadow-md ring-2 ring-[#41644A]/25'
                    : 'bg-[#EBE1D1]/65 border-white/80 hover:bg-[#EBE1D1]/90 hover:border-[#41644A]/40 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#0D4715]">{item.filename}</span>
                  <span className="text-[10px] font-mono text-[#41644A] font-semibold">{key.toUpperCase()}</span>
                </div>
                <div className="text-[11px] text-[#1F3E28] mt-1 truncate font-medium">{item.path}</div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Code Viewer */}
        <GlassPanel delay={0.1} className="lg:col-span-8 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#41644A]/20 pb-3">
            <div>
              <div className="font-mono text-xs font-bold text-[#0D4715]">{cur.path}</div>
              <div className="text-xs text-[#1F3E28] mt-1 leading-relaxed font-medium">{cur.desc}</div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-[#EBE1D1] border border-[#41644A]/30 text-[#0D4715] font-mono shadow-2xs font-semibold">
              YAML / Docker
            </span>
          </div>

          <pre className="bg-[#0D4715] text-[#EBE1D1] font-mono text-xs p-4 rounded-xl border border-[#41644A]/60 overflow-x-auto max-h-96 leading-relaxed shadow-inner">
            {cur.snippet}
          </pre>
        </GlassPanel>
      </div>
    </div>
  );
};
