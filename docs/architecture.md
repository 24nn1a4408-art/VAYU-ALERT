# CycloneFusion-AI System Architecture

## Overview
CycloneFusion-AI is an end-to-end multimodal spatiotemporal deep learning research platform dedicated to tropical cyclone analysis across the North Indian Ocean (Bay of Bengal and Arabian Sea).

## Architectural Components

```
Satellite Stream (T-24..T)      ERA5 Environmental Grid         Track History (T-24..T)
    [TIR1, TIR2, WV, VIS]            [SST, Shear, RH, Vor]          [Lat, Lon, Wind, Pres]
             │                                 │                               │
             ▼                                 ▼                               ▼
    Spatial Backbone (CNN/ConvNeXt)      MLP / GNN Feature Embedder       GRU / Temporal Embedder
             │                                 │                               │
             ▼                                 │                               │
    Temporal ConvLSTM Layer                    │                               │
             │                                 │                               │
             └────────────────► Cross-Attention Multimodal Fusion ◄───────────┘
                                               │
                                               ▼
                                   Temporal Transformer Encoder
                                               │
             ┌─────────────────────────┬───────┴────────┬─────────────────────────┐
             ▼                         ▼                ▼                         ▼
   Head 1: Identification   Head 2: Classification   Head 3: Localization   Head 4: Intensity & Quantiles
   (Presence & Confidence)  (IMD 7-Stage Category)   (Geodesic Lat/Lon)     (+6h, +12h, +24h, +48h)
```

## Non-Negotiable Research Constraints
1. **Rule 1 — Never fabricate results**: All metric slots remain explicitly labeled `"Not yet evaluated"` until training & testing execute on ground truth splits.
2. **Rule 2 — Leakage-Safe Event Partitioning**: Splits are partitioned strictly by cyclone event (e.g. Cyclone Amphan, Cyclone Fani), never by random frame slicing.
3. **Rule 3 — Explicit Missing Modality Representation**: Missing channels (e.g. VIS channel at night, sensor dropouts) utilize explicit binary masking tensors rather than zero-filling.
4. **Rule 4 — Component Justification**: Every component provides quantified computational cost and meteorologically grounded justification.
5. **Rule 5 — Baselines are Mandatory**: Evaluated against CNN, CNN+LSTM, CNN+ConvLSTM, and Transformer baselines on the exact same test partition.
6. **Rule 6 — Research Prototype Notice**: Not an official operational warning system; decision-support and academic benchmarking only.
