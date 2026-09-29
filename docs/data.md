# CycloneFusion-AI Data Ingestion & Validation Architecture

## Basin Focus
- **Primary Basin**: North Indian Ocean (NIO)
- **Sub-basins**: Bay of Bengal (BOB) and Arabian Sea (AS)
- **BBOX Latitude**: 0.0°N to 35.0°N
- **BBOX Longitude**: 45.0°E to 105.0°E

## Data Modalities & Sensors
1. **Geostationary Satellite Imagery**:
   - INSAT-3D and INSAT-3DR Imager payloads
   - Thermal Infrared 1 (TIR1, 10.8 µm): Core brightness temperature of convective cloud shields
   - Thermal Infrared 2 (TIR2, 12.0 µm): Split-window differential absorption
   - Water Vapour (WV, 6.7 µm): Upper-tropospheric moisture and outflow dynamics
   - Visible (VIS, 0.65 µm): Daytime high-resolution structure (masked out at night)

2. **Environmental Reanalysis (ERA5)**:
   - Sea Surface Temperature (SST) [K]: Oceanic thermal energy potential
   - 200–850 hPa Vertical Wind Shear (VWS) [m/s]: Key kinematic barrier to intensification
   - 700 hPa Relative Humidity (RH) [%]: Mid-level dry air intrusion tracking
   - Mean Sea Level Pressure (MSLP) [hPa]: Background synoptic pressure gradient
   - 850 hPa Relative Vorticity [s⁻¹]: Low-level spin-up spin dynamics

3. **Authoritative Best-Track Historical Records**:
   - IMD (India Meteorological Department / RSMC New Delhi)
   - Canonical IBTrACS v04r00 WMO records
   - 6-hourly synoptic fixes: Lat, Lon, Maximum Sustained Wind (10-min / 3-min / 1-min standard conversions documented), Central Pressure, Nature of system.

## Validation Gates (Phase 1)
All ingestion pipelines execute 12 automated integrity gates before ingestion into sequence builders:
- Gate 1: Checksum & File Corruptibility Verification
- Gate 2: Temporal Monotonicity & Synoptic 6-hour Stepping
- Gate 3: Geographic Bounding Verification (Lat ∈ [0, 40°N], Lon ∈ [40, 110°E])
- Gate 4: Meteorological Bounds (Wind ∈ [10, 200 kt], Pressure ∈ [850, 1045 hPa])
- Gate 5: Cyclone Event ID Uniqueness & Lifecycle Continuity
- Gate 6: Missingness Density Matrix & Modality Masking
- Gate 7: Duplicate Timestamp Disambiguation
- Gate 8: IMD 7-Stage Classification Mapping
- Gate 9: Spatial Resolution & Center Alignment
- Gate 10: Event Leakage Safeguards
- Gate 11: Sensor Channel Radiometric Bounds
- Gate 12: Ground Truth Distance-to-Land Concordance
