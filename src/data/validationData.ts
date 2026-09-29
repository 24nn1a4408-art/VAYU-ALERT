import { DataQualityReport, StormEvent } from '../types';

export const VALIDATION_REPORT: DataQualityReport = {
  timestamp: "2026-09-04T17:58:44Z",
  validator_version: "1.0.0",
  status: "PASS",
  gates_passed: 10,
  gates_failed: 0,
  gates_warned: 0,
  mandatory_checks_passed: true,
  gates: {
    gate_01_file_existence: {
      passed: true,
      status: "PASS",
      mandatory: true,
      details: {
        all_present: true,
        files: {
          "data/raw/nio_cyclones_best_track.csv": { exists: true, size_bytes: 19721 },
          "data/raw/nio_environmental_synoptic.csv": { exists: true, size_bytes: 14167 },
          "data/raw/satellite_frames_index.csv": { exists: true, size_bytes: 22530 },
          "data/metadata/satellite_inventory.json": { exists: true, size_bytes: 1602 },
          "data/metadata/environmental_grids.json": { exists: true, size_bytes: 1134 }
        }
      }
    },
    gate_02_schema_integrity: {
      passed: true,
      status: "PASS",
      mandatory: true,
      details: {
        tracks_valid: true,
        envs_valid: true,
        sats_valid: true,
        missing_track_cols: [],
        missing_env_cols: [],
        missing_sat_cols: []
      }
    },
    gate_03_duplicate_detection: {
      passed: true,
      status: "PASS",
      mandatory: true,
      details: {
        track_duplicates: 0,
        env_duplicates: 0,
        sat_duplicates: 0,
        total_duplicates: 0
      }
    },
    gate_04_timestamp_validity: {
      passed: true,
      status: "PASS",
      mandatory: true,
      details: {
        invalid_timestamp_count: 0,
        non_monotonic_steps: 0,
        synoptic_interval_mean_hours: 6.0,
        total_intervals_evaluated: 194
      }
    },
    gate_05_coordinate_bounds: {
      passed: true,
      status: "PASS",
      mandatory: true,
      details: {
        out_of_bounds_count: 0,
        bounds_configured: { lat_range: [-5.0, 40.0], lon_range: [40.0, 110.0] },
        observed_lat_min: 5.2,
        observed_lat_max: 22.48,
        observed_lon_min: 64.97,
        observed_lon_max: 93.16
      }
    },
    gate_06_meteorological_bounds: {
      passed: true,
      status: "PASS",
      mandatory: true,
      details: {
        wind_violations: 0,
        pressure_violations: 0,
        wind_range_kt: [20.0, 140.0],
        pressure_range_hpa: [890.0, 991.7]
      }
    },
    gate_07_cyclone_lifecycles: {
      passed: true,
      status: "PASS",
      mandatory: true,
      details: {
        total_cyclones: 10,
        cyclones_with_too_few_observations: {},
        min_observations_observed: 8,
        max_observations_observed: 36
      }
    },
    gate_08_category_validity: {
      passed: true,
      status: "PASS",
      mandatory: true,
      details: {
        unmapped_categories: [],
        category_counts: { D: 38, DD: 16, CS: 39, SCS: 34, VSCS: 37, ESCS: 34, SUCS: 6 },
        valid_taxonomy: ["CS", "D", "DD", "ESCS", "LOW", "SCS", "SUCS", "VSCS"]
      }
    },
    gate_09_modality_missingness: {
      passed: true,
      status: "PASS",
      mandatory: false,
      details: {
        environmental: { sst: 5.88, shear: 5.88, rh: 5.88, mslp: 5.88, vor: 5.88 },
        satellite: { tir1: 4.41, tir2: 4.41, wv: 4.41, vis: 68.63 },
        vis_note: "VIS missingness is scientifically expected during nocturnal passes (Rule 3 explicit masking required)."
      }
    },
    gate_10_leakage_safety_rules: {
      passed: true,
      status: "PASS",
      mandatory: true,
      details: {
        rule: "Rule 2 (No intra-event frame leakage)",
        unique_cyclone_events: 10,
        sufficient_for_train_val_test_split: true,
        enforcement_policy: "Split strictly by cyclone_id; never shuffle or split synoptic frames across splits."
      }
    }
  },
  eda: {
    total_observations: 204,
    total_events: 10,
    basin_distribution: {
      "Bay of Bengal": 138,
      "Arabian Sea": 66
    },
    monthly_distribution: {
      "1": 0, "2": 0, "3": 0, "4": 28, "5": 68, "6": 36,
      "7": 8, "8": 0, "9": 14, "10": 0, "11": 10, "12": 18
    },
    seasonal_peaks: {
      pre_monsoon_peak_months: ["April", "May", "June"],
      post_monsoon_peak_months: ["October", "November", "December"],
      monsoon_hiatus_months: ["July", "August", "September"]
    },
    wind_statistics_kt: {
      mean: 62.8,
      min: 20.0,
      q25: 35.0,
      median: 58.2,
      q75: 88.5,
      q95: 122.0,
      max: 140.0
    },
    pressure_statistics_hpa: {
      mean: 968.4,
      min: 890.0,
      q25: 948.0,
      median: 974.2,
      q75: 989.5,
      q95: 998.0,
      max: 1002.0
    }
  },
  class_imbalance: {
    total_samples: 204,
    counts: { D: 38, DD: 16, CS: 39, SCS: 34, VSCS: 37, ESCS: 34, SUCS: 6 },
    percentages: { D: 18.63, DD: 7.84, CS: 19.12, SCS: 16.67, VSCS: 18.14, ESCS: 16.67, SUCS: 2.94 },
    rare_categories: ["DD", "SUCS"],
    loss_weighting_recommendation: "Use focal loss or inverse-frequency class weights for rare high-severity categories (ESCS, SuCS)."
  },
  extreme_events: {
    rapid_intensification_episodes_detected: 4,
    ri_samples: [
      { cyclone_id: "NIO_2020_AMPHAN", storm_name: "Amphan", start_time: "2020-05-16 00:00:00", delta_wind_24h_kt: 55.4 },
      { cyclone_id: "NIO_2019_FANI", storm_name: "Fani", start_time: "2019-04-26 06:00:00", delta_wind_24h_kt: 42.1 },
      { cyclone_id: "NIO_2021_TAUKTAE", storm_name: "Tauktae", start_time: "2021-05-14 00:00:00", delta_wind_24h_kt: 36.8 },
      { cyclone_id: "NIO_2023_MOCHA", storm_name: "Mocha", start_time: "2023-05-09 00:00:00", delta_wind_24h_kt: 48.2 }
    ],
    severe_observations_ge_64kt: 77,
    extreme_observations_ge_90kt: 40,
    policy: "RI defined as >= 30 kt increase in 24h as per IMD/NHC operational standard."
  },
  missingness: {
    environmental: { sst: 5.88, shear: 5.88, rh: 5.88, mslp: 5.88, vor: 5.88 },
    satellite: { tir1: 4.41, tir2: 4.41, wv: 4.41, vis: 68.63 },
    vis_note: "VIS missingness is scientifically expected during nocturnal passes (Rule 3 explicit masking required)."
  },
  readiness_summary: {
    ready_for_phase_2_preprocessing: true,
    required_actions_before_model_training: [
      "Construct synoptic 5-step rolling sequences (T-24, T-18, T-12, T-6, T)",
      "Apply event-level stratified split (train_events.csv, val_events.csv, test_events.csv)",
      "Compute modality presence masks for nocturnal VIS channel & occasional ERA5 dropouts",
      "Fit z-score normalization on training partition ONLY to prevent data leakage"
    ],
    dataset_limitations_identified: [
      "Satellite frames are currently indexed; full production pipeline requires high-volume INSAT archive download",
      "Arabian Sea sample count is lower than Bay of Bengal, requiring basin-stratified sampling",
      "Super Cyclonic Storm (SuCS) is naturally rare (2.9% of climatological records)"
    ]
  }
};

export const STORM_CATALOG: StormEvent[] = [
  { id: "NIO_2020_AMPHAN", name: "Amphan", basin: "Bay of Bengal", observations: 24, maxWindKt: 140, minPressureHpa: 906, peakCategory: "SuCS", startDate: "2020-05-16", rapidIntensification: true },
  { id: "NIO_2019_FANI", name: "Fani", basin: "Bay of Bengal", observations: 28, maxWindKt: 115, minPressureHpa: 932, peakCategory: "ESCS", startDate: "2019-04-26", rapidIntensification: true },
  { id: "NIO_2021_TAUKTAE", name: "Tauktae", basin: "Arabian Sea", observations: 22, maxWindKt: 100, minPressureHpa: 950, peakCategory: "ESCS", startDate: "2021-05-14", rapidIntensification: true },
  { id: "NIO_2023_BIPARJOY", name: "Biparjoy", basin: "Arabian Sea", observations: 36, maxWindKt: 90, minPressureHpa: 960, peakCategory: "ESCS", startDate: "2023-06-06", rapidIntensification: false },
  { id: "NIO_2023_MOCHA", name: "Mocha", basin: "Bay of Bengal", observations: 24, maxWindKt: 115, minPressureHpa: 938, peakCategory: "ESCS", startDate: "2023-05-09", rapidIntensification: true },
  { id: "NIO_2021_GULAB", name: "Gulab", basin: "Bay of Bengal", observations: 14, maxWindKt: 45, minPressureHpa: 992, peakCategory: "CS", startDate: "2021-09-24", rapidIntensification: false },
  { id: "NIO_2022_ASANI", name: "Asani", basin: "Bay of Bengal", observations: 20, maxWindKt: 65, minPressureHpa: 982, peakCategory: "VSCS", startDate: "2022-05-07", rapidIntensification: false },
  { id: "NIO_2022_MANDOUS", name: "Mandous", basin: "Bay of Bengal", observations: 18, maxWindKt: 55, minPressureHpa: 988, peakCategory: "SCS", startDate: "2022-12-06", rapidIntensification: false },
  { id: "NIO_2021_BOB05", name: "BOB_05", basin: "Bay of Bengal", observations: 10, maxWindKt: 30, minPressureHpa: 1000, peakCategory: "DD", startDate: "2021-11-10", rapidIntensification: false },
  { id: "NIO_2022_ARB02", name: "ARB_02", basin: "Arabian Sea", observations: 8, maxWindKt: 25, minPressureHpa: 1002, peakCategory: "D", startDate: "2022-07-16", rapidIntensification: false }
];
