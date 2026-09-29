export type UserRole = 'citizen' | 'disaster_mgmt';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  relation: string;
}

export interface UserProfile {
  name: string;
  mobile: string;
  email: string;
  city: string;
  lat: number;
  lon: number;
  emergencyContacts: EmergencyContact[];
}

export type AlertSeverity = 'none' | 'green' | 'yellow' | 'red';


export interface AlertHistoryItem {
  id: string;
  cycloneName: string;
  severity: AlertSeverity;
  location: string;
  message: string;
  timestamp: string;
}

export interface SeaBasin {
  id: string;
  name: string;
  ocean: string;
  lat: number;
  lon: number;
  svgX: number; // 0-100 percentage for world map
  svgY: number; // 0-100 percentage for world map
  alertLevel: AlertSeverity;
  activeCycloneId?: string;
  // Regular climatic conditions
  sstCelsius: number;
  surfaceWindKt: number;
  surfaceWindKmh: number;
  waveHeightM: number;
  pressureHpa: number;
  humidityPct: number;
  climatePrediction: string;
  cycloneRiskIndex: 'Low' | 'Moderate' | 'High' | 'Severe';
  synopticSummary: string;
}

export interface AffectedAreaZone {
  zoneName: string;
  districts: string[];
  populationAtRisk?: string;
  actionRequired: string;
  expectedSurgeMeters: string;
  maxWindKmh: string;
  sheltersOpen?: number;
}

export interface TrackWaypoint {
  timeStep: string;
  hoursAhead: number;
  lat: number;
  lon: number;
  windKt: number;
  windKmh: number;
  pressureHpa: number;
  category: string;
  movement: string;
  landfallStatus?: 'Approaching Sea' | 'Coastal Proximity' | 'Severe Landfall' | 'Inland Weakening' | 'Dissipation' | string;
  notes: string;
}

export interface CycloneData {
  id: string;
  name: string;
  basinId: string;
  basinName: string;
  status: 'Forming' | 'Active' | 'Rapidly Intensifying' | 'Landfall Imminent';
  alertLevel: 'red' | 'yellow' | 'green';
  
  // Identification
  location: {
    lat: number;
    lon: number;
    distanceToCoastKm: number;
    nearestLandmark: string;
  };
  impactRangeKm: number; // e.g. 280 km alert radius
  stormSizeKm: number; // outer diameter e.g. 520 km
  eyeDiameterKm: number; // e.g. 35 km
  direction: string; // e.g. "NNW"
  headingAngleDeg: number;
  forwardSpeedKmh: number; // e.g. 18 km/h
  
  // Intensity in values
  intensity: {
    windKt: number;
    windKmh: number;
    gustsKmh: number;
    categoryCode: string; // "VSCS", "ESCS", "Cat 3"
    categoryName: string; // "Very Severe Cyclonic Storm"
    dvorakTNumber: number; // e.g. 4.5
    ciNumber: number; // e.g. 5.0
    cloudTopTempC: number; // e.g. -78
    eyeTempC: number; // e.g. -14
    riProbabilityPct: number; // e.g. 78%
    quadrantRadiiKm: {
      ne: number;
      se: number;
      sw: number;
      nw: number;
    };
  };

  // Pressure - 3 modes & percentage
  pressure: {
    centralPressureHpa: number; // Mode 1: Central Atmospheric Pressure
    pressureDropHpa: number; // Mode 2: Pressure Drop ΔP (ambient - central)
    ambientPressureHpa: number; // Mode 3: Outer Ambient Pressure (e.g. 1010 hPa)
    dropPercentage: number; // % drop from ambient
    deficitAnomalyPct: number; // anomaly compared to seasonal normal
    barometricTrend: string; // e.g. "Falling rapidly (-3.2 hPa/3h)"
    gradientHpaPerKm: number;
  };

  // Affected Areas
  affectedAreas: {
    highAlertRed: AffectedAreaZone;
    mediumAlertYellow: AffectedAreaZone;
    leastAlertGreen: AffectedAreaZone;
  };

  // Track forecasting
  trackForecast: TrackWaypoint[];
  historicalTrack?: TrackWaypoint[];
}

export interface ValidationGateDetail {
  passed: boolean;
  status: 'PASS' | 'WARN' | 'FAIL';
  mandatory: boolean;
  details: Record<string, any>;
}

export interface EDASummary {
  total_observations: number;
  total_events: number;
  basin_distribution: Record<string, number>;
  monthly_distribution: Record<string, number>;
  seasonal_peaks: {
    pre_monsoon_peak_months: string[];
    post_monsoon_peak_months: string[];
    monsoon_hiatus_months: string[];
  };
  wind_statistics_kt: {
    mean: number;
    min: number;
    q25: number;
    median: number;
    q75: number;
    q95: number;
    max: number;
  };
  pressure_statistics_hpa: {
    mean: number;
    min: number;
    q25: number;
    median: number;
    q75: number;
    q95: number;
    max: number;
  };
}

export interface ClassImbalance {
  total_samples: number;
  counts: Record<string, number>;
  percentages: Record<string, number>;
  rare_categories: string[];
  loss_weighting_recommendation: string;
}

export interface ExtremeEvents {
  rapid_intensification_episodes_detected: number;
  ri_samples: Array<{
    cyclone_id: string;
    storm_name: string;
    start_time: string;
    delta_wind_24h_kt: number;
  }>;
  severe_observations_ge_64kt: number;
  extreme_observations_ge_90kt: number;
  policy: string;
}

export interface DataQualityReport {
  timestamp: string;
  validator_version: string;
  status: 'PASS' | 'FAIL';
  gates_passed: number;
  gates_failed: number;
  gates_warned: number;
  mandatory_checks_passed: boolean;
  gates: Record<string, ValidationGateDetail>;
  eda: EDASummary;
  class_imbalance: ClassImbalance;
  extreme_events: ExtremeEvents;
  missingness?: any;
  readiness_summary?: any;
}

export interface StormEvent {
  id: string;
  name: string;
  basin: string;
  observations: number;
  maxWindKt: number;
  minPressureHpa: number;
  peakCategory: string;
  startDate: string;
  rapidIntensification: boolean;
}
