import { SeaBasin, CycloneData, UserProfile } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Aarav Sharma',
  mobile: '+91 98450 12345',
  email: 'aarav.sharma@example.com',
  city: 'Puri, Odisha',
  lat: 19.8135,
  lon: 85.8312,
  emergencyContacts: [
    {
      id: 'c1',
      name: 'Priya Sharma (Spouse)',
      phone: '+91 98450 88888',
      email: 'priya.s@example.com',
      relation: 'Immediate Family'
    },
    {
      id: 'c2',
      name: 'Odisha Disaster Control (SEOC)',
      phone: '1070 / 0674-2534177',
      email: 'seoc.odisha@nic.in',
      relation: 'Emergency Authority'
    },
    {
      id: 'c3',
      name: 'Rohan (Brother - Bhubaneswar)',
      phone: '+91 97711 54321',
      email: 'rohan.s@example.com',
      relation: 'Family Relative'
    }
  ]
};

export const POPULAR_COASTAL_LOCATIONS = [
  { city: 'Puri, Odisha', lat: 19.8135, lon: 85.8312, state: 'Odisha' },
  { city: 'Paradip, Odisha', lat: 20.3164, lon: 86.6114, state: 'Odisha' },
  { city: 'Visakhapatnam, AP', lat: 17.6868, lon: 83.2185, state: 'Andhra Pradesh' },
  { city: 'Kolkata / Digha, WB', lat: 21.6266, lon: 87.5074, state: 'West Bengal' },
  { city: 'Chennai, TN', lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu' },
  { city: 'Kanyakumari, TN', lat: 8.0883, lon: 77.5385, state: 'Tamil Nadu' },
  { city: 'Kochi, Kerala', lat: 9.9312, lon: 76.2673, state: 'Kerala' },
  { city: 'Mumbai, Maharashtra', lat: 18.9220, lon: 72.8347, state: 'Maharashtra' },
  { city: 'Surat / Veraval, Gujarat', lat: 20.9077, lon: 70.3679, state: 'Gujarat' },
  { city: 'Chittagong, Bangladesh', lat: 22.3569, lon: 91.7832, state: 'Chittagong Div' },
];

export const WORLD_SEAS: SeaBasin[] = [
  {
    id: 'bay-of-bengal',
    name: 'Bay of Bengal (North Indian Ocean)',
    ocean: 'Indian Ocean',
    lat: 15.5,
    lon: 88.0,
    svgX: 68,
    svgY: 48,
    alertLevel: 'red',
    activeCycloneId: 'cyclone-dana',
    sstCelsius: 30.6,
    surfaceWindKt: 42,
    surfaceWindKmh: 78,
    waveHeightM: 5.4,
    pressureHpa: 988,
    humidityPct: 88,
    cycloneRiskIndex: 'Severe',
    climatePrediction: 'High ocean heat content (115 kJ/cm²) fueling rapid convective clustering over West-Central Bay. Low vertical wind shear (8-12 kt) sustains severe intensification.',
    synopticSummary: 'Active Very Severe Cyclonic Storm DANA centered at 16.8°N, 87.2°E moving NNW at 18 km/h. Coastal communities under High Red Alert.'
  },
  {
    id: 'arabian-sea',
    name: 'Arabian Sea (East Central)',
    ocean: 'Indian Ocean',
    lat: 16.0,
    lon: 66.0,
    svgX: 62,
    svgY: 46,
    alertLevel: 'yellow',
    activeCycloneId: 'cyclone-tej',
    sstCelsius: 29.4,
    surfaceWindKt: 32,
    surfaceWindKmh: 59,
    waveHeightM: 3.8,
    pressureHpa: 996,
    humidityPct: 78,
    cycloneRiskIndex: 'High',
    climatePrediction: 'Moderate SSTs with dry continental mid-level air intrusion from northwest limit rapid escalation, but gale wind field expands across shipping channels.',
    synopticSummary: 'Severe Cyclonic Storm TEJ tracking northwestward. Fishermen advised total suspension of deep sea operations.'
  },
  {
    id: 'andaman-sea',
    name: 'Andaman Sea',
    ocean: 'Indian Ocean',
    lat: 11.2,
    lon: 94.5,
    svgX: 72,
    svgY: 53,
    alertLevel: 'yellow',
    sstCelsius: 30.1,
    surfaceWindKt: 24,
    surfaceWindKmh: 44,
    waveHeightM: 2.9,
    pressureHpa: 1002,
    humidityPct: 84,
    cycloneRiskIndex: 'Moderate',
    climatePrediction: 'Strong low-level convergence producing squally weather and active feeder bands into the main Bay of Bengal vortex system.',
    synopticSummary: 'Squally winds 45-55 km/h gusting to 65 km/h over Andaman & Nicobar archipelagos.'
  },
  {
    id: 'south-china-sea',
    name: 'South China Sea',
    ocean: 'Pacific Ocean',
    lat: 16.5,
    lon: 114.0,
    svgX: 79,
    svgY: 47,
    alertLevel: 'red',
    activeCycloneId: 'typhoon-yagi',
    sstCelsius: 31.2,
    surfaceWindKt: 58,
    surfaceWindKmh: 107,
    waveHeightM: 6.2,
    pressureHpa: 975,
    humidityPct: 92,
    cycloneRiskIndex: 'Severe',
    climatePrediction: 'Very high upper ocean heat content and vigorous equatorial moisture feed producing intense convective bursts.',
    synopticSummary: 'Super Typhoon YAGI traversing west-northwest with catastrophic gale radii threatening maritime routes and islands.'
  },
  {
    id: 'philippine-sea',
    name: 'Philippine Sea (West Pacific)',
    ocean: 'Pacific Ocean',
    lat: 18.0,
    lon: 130.0,
    svgX: 85,
    svgY: 45,
    alertLevel: 'green',
    sstCelsius: 29.8,
    surfaceWindKt: 18,
    surfaceWindKmh: 33,
    waveHeightM: 2.1,
    pressureHpa: 1006,
    humidityPct: 79,
    cycloneRiskIndex: 'Moderate',
    climatePrediction: 'Broad cyclonic gyre organizing east of Luzon. Favorable outflow aloft may trigger tropical genesis in 48-72 hours.',
    synopticSummary: 'Tropical disturbance under continuous satellite and scatterometer surveillance.'
  },
  {
    id: 'north-atlantic-caribbean',
    name: 'Caribbean Sea & Gulf of Mexico',
    ocean: 'Atlantic Ocean',
    lat: 22.0,
    lon: -84.0,
    svgX: 25,
    svgY: 42,
    alertLevel: 'red',
    activeCycloneId: 'hurricane-helene',
    sstCelsius: 30.5,
    surfaceWindKt: 50,
    surfaceWindKmh: 93,
    waveHeightM: 5.1,
    pressureHpa: 980,
    humidityPct: 86,
    cycloneRiskIndex: 'Severe',
    climatePrediction: 'Loop Current intrusion provides deep reservoir of high enthalpy waters conducive to rapid barometric drops.',
    synopticSummary: 'Major Hurricane HELENE accelerating northward with massive storm surge threat across low-lying coastal marshes.'
  },
  {
    id: 'south-indian-ocean',
    name: 'South Indian Ocean',
    ocean: 'Indian Ocean',
    lat: -15.0,
    lon: 75.0,
    svgX: 65,
    svgY: 72,
    alertLevel: 'none',
    sstCelsius: 26.8,
    surfaceWindKt: 16,
    surfaceWindKmh: 30,
    waveHeightM: 2.4,
    pressureHpa: 1014,
    humidityPct: 68,
    cycloneRiskIndex: 'Low',
    climatePrediction: 'Trade wind inversion and seasonal winter cooling prevent organized cyclogenesis. Tranquil oceanic baseline.',
    synopticSummary: 'Standard high-pressure ridge dominance. No cyclonic warnings in effect.'
  },
  {
    id: 'coral-sea',
    name: 'Coral Sea (SW Pacific)',
    ocean: 'Pacific Ocean',
    lat: -18.0,
    lon: 155.0,
    svgX: 90,
    svgY: 70,
    alertLevel: 'green',
    sstCelsius: 27.9,
    surfaceWindKt: 19,
    surfaceWindKmh: 35,
    waveHeightM: 2.3,
    pressureHpa: 1010,
    humidityPct: 74,
    cycloneRiskIndex: 'Moderate',
    climatePrediction: 'Weak monsoon trough pulse approaching Solomon Islands with localized squalls.',
    synopticSummary: 'Routine maritime weather bulletin; marine recreation permissible with standard coastal caution.'
  },
  {
    id: 'mediterranean-sea',
    name: 'Mediterranean Sea',
    ocean: 'Atlantic Basin',
    lat: 35.0,
    lon: 18.0,
    svgX: 52,
    svgY: 34,
    alertLevel: 'none',
    sstCelsius: 25.2,
    surfaceWindKt: 14,
    surfaceWindKmh: 26,
    waveHeightM: 1.4,
    pressureHpa: 1016,
    humidityPct: 62,
    cycloneRiskIndex: 'Low',
    climatePrediction: 'Stable anticyclonic flow over Central Mediterranean. Low Medicane potential.',
    synopticSummary: 'Fair maritime visibility; normal sea conditions.'
  },
  {
    id: 'east-china-sea',
    name: 'East China Sea & Sea of Japan',
    ocean: 'Pacific Ocean',
    lat: 29.0,
    lon: 125.0,
    svgX: 84,
    svgY: 36,
    alertLevel: 'yellow',
    sstCelsius: 28.3,
    surfaceWindKt: 26,
    surfaceWindKmh: 48,
    waveHeightM: 3.1,
    pressureHpa: 1004,
    humidityPct: 76,
    cycloneRiskIndex: 'Moderate',
    climatePrediction: 'Peripheral swells generated by southern typhoon circulation impacting Ryukyu Islands and coastal navigation.',
    synopticSummary: 'Rough sea warning for coastal fishing craft. Long-period swells 3.0 meters.'
  }
];

export const CYCLONES_DATABASE: CycloneData[] = [
  {
    id: 'cyclone-dana',
    name: 'Cyclone DANA',
    basinId: 'bay-of-bengal',
    basinName: 'Bay of Bengal (North Indian Ocean)',
    status: 'Rapidly Intensifying',
    alertLevel: 'red',
    location: {
      lat: 16.8,
      lon: 87.2,
      distanceToCoastKm: 185,
      nearestLandmark: '185 km SE of Puri Coast & 210 km S of Paradip Port (Odisha)'
    },
    impactRangeKm: 320,
    stormSizeKm: 540,
    eyeDiameterKm: 32,
    direction: 'NNW (335°)',
    headingAngleDeg: 335,
    forwardSpeedKmh: 19,
    intensity: {
      windKt: 85,
      windKmh: 157,
      gustsKmh: 185,
      categoryCode: 'VSCS',
      categoryName: 'Very Severe Cyclonic Storm (IMD Stage 5)',
      dvorakTNumber: 4.5,
      ciNumber: 5.0,
      cloudTopTempC: -82,
      eyeTempC: -12,
      riProbabilityPct: 78,
      quadrantRadiiKm: {
        ne: 240,
        se: 210,
        sw: 160,
        nw: 190
      }
    },
    pressure: {
      centralPressureHpa: 962,
      pressureDropHpa: 48,
      ambientPressureHpa: 1010,
      dropPercentage: 4.75,
      deficitAnomalyPct: 88,
      barometricTrend: 'Falling rapidly (-3.8 hPa / 3h)',
      gradientHpaPerKm: 0.38
    },
    affectedAreas: {
      highAlertRed: {
        zoneName: 'Core Landfall Corridor (0–75 km radius)',
        districts: ['Puri', 'Jagatsinghpur', 'Kendrapara', 'Bhadrak', 'Balasore', 'East Midnapore'],
        populationAtRisk: '3.8 Million Citizens',
        actionRequired: 'MANDATORY IMMEDIATE EVACUATION. Total suspension of all fishing, rail, road, and marine port operations. Storm shelters fully staffed.',
        expectedSurgeMeters: '3.5 to 4.8 meters above astronomical tide',
        maxWindKmh: '135–165 km/h',
        sheltersOpen: 840
      },
      mediumAlertYellow: {
        zoneName: 'Severe Gale & Torrential Rain Band (75–180 km radius)',
        districts: ['Bhubaneswar / Khordha', 'Cuttack', 'Jajpur', 'Ganjam', 'Mayurbhanj', 'South 24 Parganas'],
        actionRequired: 'Precautionary evacuation of kutcha houses. Power grid pre-emptive shutdown during peak winds. Medical and water supply stockpiled.',
        expectedSurgeMeters: '1.5 to 2.5 meters in river estuaries',
        maxWindKmh: '85–115 km/h',
        sheltersOpen: 412
      },
      leastAlertGreen: {
        zoneName: 'Outer Rainband Watch & Advisory (180–320 km radius)',
        districts: ['Visakhapatnam', 'Srikakulam', 'Kolkata Urban', 'Howrah', 'Hooghly', 'Ranchi (Southern fringe)'],
        actionRequired: 'Advisory watch. Keep emergency kits ready, clear street drains, monitor official AIR/Doordarshan/VAYU alerts. Avoid beach visits.',
        expectedSurgeMeters: '0.5 to 1.2 meters rough surf',
        maxWindKmh: '50–75 km/h',
        sheltersOpen: 120
      }
    },
    historicalTrack: [
      {
        timeStep: 'T-24h (Genesis)',
        hoursAhead: -24,
        lat: 13.5,
        lon: 89.6,
        windKt: 25,
        windKmh: 46,
        pressureHpa: 1004,
        category: 'Depression (Genesis)',
        movement: 'NW at 15 km/h',
        notes: 'Initial low pressure cyclogenesis detected by satellite over SE Bay of Bengal.'
      },
      {
        timeStep: 'T-18h',
        hoursAhead: -18,
        lat: 14.4,
        lon: 88.9,
        windKt: 35,
        windKmh: 65,
        pressureHpa: 998,
        category: 'Deep Depression',
        movement: 'NNW at 16 km/h',
        notes: 'Consolidating curved banding features and central cold cover.'
      },
      {
        timeStep: 'T-12h',
        hoursAhead: -12,
        lat: 15.3,
        lon: 88.2,
        windKt: 50,
        windKmh: 92,
        pressureHpa: 988,
        category: 'Cyclonic Storm',
        movement: 'NNW at 18 km/h',
        notes: 'Named Cyclone DANA by RSMC New Delhi as sustained winds breached 34 knots.'
      },
      {
        timeStep: 'T-6h',
        hoursAhead: -6,
        lat: 16.1,
        lon: 87.7,
        windKt: 70,
        windKmh: 130,
        pressureHpa: 974,
        category: 'Severe Cyclonic Storm',
        movement: 'NNW at 19 km/h',
        notes: 'Rapid intensification phase over 30.5°C warm ocean thermal core.'
      }
    ],
    trackForecast: [
      {
        timeStep: 'T (Current 06:00 UTC)',
        hoursAhead: 0,
        lat: 16.8,
        lon: 87.2,
        windKt: 85,
        windKmh: 157,
        pressureHpa: 962,
        category: 'VSCS (Very Severe)',
        movement: 'NNW at 19 km/h',
        landfallStatus: 'Approaching Sea',
        notes: 'Deep central convective core; well-defined eye visible on INSAT-3DR thermal IR.'
      },
      {
        timeStep: 'T+6h (12:00 UTC)',
        hoursAhead: 6,
        lat: 17.7,
        lon: 86.8,
        windKt: 90,
        windKmh: 167,
        pressureHpa: 956,
        category: 'VSCS (Peak Intensity)',
        movement: 'NNW at 18 km/h',
        landfallStatus: 'Approaching Sea',
        notes: 'Maximum enthalpy extraction over warm ocean eddy. Outer spiral bands striking coastal Odisha.'
      },
      {
        timeStep: 'T+12h (18:00 UTC)',
        hoursAhead: 12,
        lat: 18.6,
        lon: 86.4,
        windKt: 95,
        windKmh: 176,
        pressureHpa: 950,
        category: 'ESCS (Extremely Severe)',
        movement: 'NNW at 17 km/h',
        landfallStatus: 'Coastal Proximity',
        notes: 'Storm surge inundation begins 4 hours prior to center arrival. Gale force winds inland.'
      },
      {
        timeStep: 'T+18h (00:00 UTC)',
        hoursAhead: 18,
        lat: 19.9,
        lon: 86.1,
        windKt: 90,
        windKmh: 167,
        pressureHpa: 954,
        category: 'ESCS / Landfall',
        movement: 'NW at 16 km/h',
        landfallStatus: 'Severe Landfall',
        notes: 'LANDFALL CORRIDOR: Between Puri and Dhamra Port. Extreme destruction to thatched structures and power lines.'
      },
      {
        timeStep: 'T+24h (06:00 UTC)',
        hoursAhead: 24,
        lat: 21.0,
        lon: 85.8,
        windKt: 65,
        windKmh: 120,
        pressureHpa: 978,
        category: 'SCS (Severe Storm)',
        movement: 'North at 15 km/h',
        landfallStatus: 'Inland Weakening',
        notes: 'Frictional drag over interior Odisha hills; heavy to extremely heavy downpours (200-300 mm).'
      },
      {
        timeStep: 'T+48h (06:00 UTC +1d)',
        hoursAhead: 48,
        lat: 23.2,
        lon: 85.5,
        windKt: 35,
        windKmh: 65,
        pressureHpa: 998,
        category: 'CS / Deep Depression',
        movement: 'NNE at 14 km/h',
        landfallStatus: 'Dissipation',
        notes: 'Weakening into a depression over Gangetic West Bengal and Jharkhand.'
      }
    ]
  },
  {
    id: 'cyclone-tej',
    name: 'Cyclone TEJ',
    basinId: 'arabian-sea',
    basinName: 'Arabian Sea (East Central)',
    status: 'Active',
    alertLevel: 'yellow',
    location: {
      lat: 14.2,
      lon: 63.8,
      distanceToCoastKm: 420,
      nearestLandmark: '420 km ESE of Salalah (Oman) & 680 km W of Goa (India)'
    },
    impactRangeKm: 240,
    stormSizeKm: 460,
    eyeDiameterKm: 28,
    direction: 'WNW (295°)',
    headingAngleDeg: 295,
    forwardSpeedKmh: 15,
    intensity: {
      windKt: 65,
      windKmh: 120,
      gustsKmh: 140,
      categoryCode: 'VSCS',
      categoryName: 'Very Severe Cyclonic Storm (IMD Stage 5)',
      dvorakTNumber: 4.0,
      ciNumber: 4.0,
      cloudTopTempC: -74,
      eyeTempC: -18,
      riProbabilityPct: 45,
      quadrantRadiiKm: {
        ne: 180,
        se: 160,
        sw: 140,
        nw: 150
      }
    },
    pressure: {
      centralPressureHpa: 980,
      pressureDropHpa: 30,
      ambientPressureHpa: 1010,
      dropPercentage: 2.97,
      deficitAnomalyPct: 62,
      barometricTrend: 'Steady fall (-1.9 hPa / 3h)',
      gradientHpaPerKm: 0.25
    },
    affectedAreas: {
      highAlertRed: {
        zoneName: 'Direct Landfall Zone (Yemen / Oman Border)',
        districts: ['Al Mahrah (Yemen)', 'Dhofar Governorate (Oman)'],
        populationAtRisk: '450,000 Citizens',
        actionRequired: 'Flash flood warnings in wadis. Evacuation of coastal fishing villages. Emergency shelter activation.',
        expectedSurgeMeters: '2.0 to 3.2 meters',
        maxWindKmh: '115–140 km/h',
        sheltersOpen: 85
      },
      mediumAlertYellow: {
        zoneName: 'Maritime High Seas & Indian Coastal Swells',
        districts: ['South Gujarat Maritime Zone', 'Maharashtra Coast (Mumbai to Ratnagiri)', 'Goa Waters'],
        actionRequired: 'Hoist Warning Signal No. 3 at major ports. Small craft and fishing boats stay in harbour.',
        expectedSurgeMeters: '1.0 to 1.8 meters swell',
        maxWindKmh: '55–75 km/h',
        sheltersOpen: 45
      },
      leastAlertGreen: {
        zoneName: 'Western Ghats Peripheral Moisture',
        districts: ['Karnataka Coastal Belt', 'North Kerala Coast'],
        actionRequired: 'Scattered squalls and isolated rainfall watch. Standard coastal awareness.',
        expectedSurgeMeters: '0.8 meters',
        maxWindKmh: '40–55 km/h',
        sheltersOpen: 20
      }
    },
    historicalTrack: [
      {
        timeStep: 'T-24h (Genesis)',
        hoursAhead: -24,
        lat: 11.8,
        lon: 68.6,
        windKt: 25,
        windKmh: 46,
        pressureHpa: 1006,
        category: 'Depression',
        movement: 'WNW at 14 km/h',
        notes: 'Low pressure area concentrated into depression over SE Arabian Sea.'
      },
      {
        timeStep: 'T-12h',
        hoursAhead: -12,
        lat: 13.0,
        lon: 66.2,
        windKt: 45,
        windKmh: 83,
        pressureHpa: 994,
        category: 'Cyclonic Storm',
        movement: 'WNW at 15 km/h',
        notes: 'Cyclone TEJ named; gale wind radius expands across central shipping lanes.'
      },
      {
        timeStep: 'T-6h',
        hoursAhead: -6,
        lat: 13.6,
        lon: 65.0,
        windKt: 55,
        windKmh: 102,
        pressureHpa: 986,
        category: 'Severe Cyclonic Storm',
        movement: 'WNW at 15 km/h',
        notes: 'Dry continental air entrainment from Arabian peninsula begins.'
      }
    ],
    trackForecast: [
      {
        timeStep: 'T (Current)',
        hoursAhead: 0,
        lat: 14.2,
        lon: 63.8,
        windKt: 65,
        windKmh: 120,
        pressureHpa: 980,
        category: 'VSCS',
        movement: 'WNW at 15 km/h',
        landfallStatus: 'Approaching Sea',
        notes: 'Tracking across central Arabian Sea warm tongue.'
      },
      {
        timeStep: 'T+12h',
        hoursAhead: 12,
        lat: 14.8,
        lon: 61.2,
        windKt: 70,
        windKmh: 130,
        pressureHpa: 974,
        category: 'VSCS',
        movement: 'WNW at 16 km/h',
        landfallStatus: 'Approaching Sea',
        notes: 'Dry air entrainment slowing rapid intensification.'
      },
      {
        timeStep: 'T+24h',
        hoursAhead: 24,
        lat: 15.6,
        lon: 58.4,
        windKt: 65,
        windKmh: 120,
        pressureHpa: 982,
        category: 'SCS',
        movement: 'NW at 14 km/h',
        landfallStatus: 'Coastal Proximity',
        notes: 'Approaching Dhofar / Al Mahrah coastal waters.'
      },
      {
        timeStep: 'T+48h',
        hoursAhead: 48,
        lat: 16.5,
        lon: 53.9,
        windKt: 50,
        windKmh: 92,
        pressureHpa: 994,
        category: 'CS / Landfall',
        movement: 'West at 12 km/h',
        landfallStatus: 'Severe Landfall',
        notes: 'Landfall near Al Mahrah coast with intense wadi flash flooding.'
      }
    ]
  },
  {
    id: 'typhoon-yagi',
    name: 'Super Typhoon YAGI',
    basinId: 'south-china-sea',
    basinName: 'South China Sea',
    status: 'Active',
    alertLevel: 'red',
    location: {
      lat: 19.4,
      lon: 112.5,
      distanceToCoastKm: 140,
      nearestLandmark: '140 km East of Wenchang, Hainan Island (China)'
    },
    impactRangeKm: 380,
    stormSizeKm: 620,
    eyeDiameterKm: 42,
    direction: 'WNW (285°)',
    headingAngleDeg: 285,
    forwardSpeedKmh: 21,
    intensity: {
      windKt: 115,
      windKmh: 213,
      gustsKmh: 250,
      categoryCode: 'Cat 4 / Super Typhoon',
      categoryName: 'Super Typhoon (Category 4 Equivalent)',
      dvorakTNumber: 6.0,
      ciNumber: 6.0,
      cloudTopTempC: -85,
      eyeTempC: 8,
      riProbabilityPct: 85,
      quadrantRadiiKm: {
        ne: 310,
        se: 280,
        sw: 220,
        nw: 260
      }
    },
    pressure: {
      centralPressureHpa: 935,
      pressureDropHpa: 75,
      ambientPressureHpa: 1010,
      dropPercentage: 7.42,
      deficitAnomalyPct: 98,
      barometricTrend: 'Extreme drop (-5.1 hPa / 3h)',
      gradientHpaPerKm: 0.55
    },
    affectedAreas: {
      highAlertRed: {
        zoneName: 'Catastrophic Destruction Zone',
        districts: ['Hainan (Wenchang, Haikou)', 'Guangdong (Zhanjiang)', 'Quang Ninh (Vietnam)'],
        populationAtRisk: '8.2 Million Citizens',
        actionRequired: 'MAXIMUM EMERGENCY EVACUATION. Ground all flights, halt ferry service across Qiongzhou Strait. Structural red-line warnings.',
        expectedSurgeMeters: '4.5 to 6.2 meters catastrophic storm surge',
        maxWindKmh: '200–240 km/h',
        sheltersOpen: 1450
      },
      mediumAlertYellow: {
        zoneName: 'Major Impact Belt',
        districts: ['Guangxi Coast', 'Haiphong / Hanoi (Vietnam)', 'Hong Kong Waters'],
        actionRequired: 'Cancel outdoor activities, secure high-rise construction, preposition flood rescue teams.',
        expectedSurgeMeters: '2.0 to 3.5 meters',
        maxWindKmh: '110–160 km/h',
        sheltersOpen: 620
      },
      leastAlertGreen: {
        zoneName: 'Outer Peripheral Squalls',
        districts: ['Da Nang (Vietnam)', 'Southern Fujian', 'Central Laos border'],
        actionRequired: 'Mudslide & landslide advisories in mountainous regions.',
        expectedSurgeMeters: '1.2 meters',
        maxWindKmh: '60–85 km/h',
        sheltersOpen: 210
      }
    },
    historicalTrack: [
      {
        timeStep: 'T-24h (Luzon Crossing)',
        hoursAhead: -24,
        lat: 17.8,
        lon: 118.2,
        windKt: 65,
        windKmh: 120,
        pressureHpa: 980,
        category: 'Typhoon',
        movement: 'WNW at 22 km/h',
        notes: 'Emerging into South China Sea after grazing northern Luzon.'
      },
      {
        timeStep: 'T-12h (Rapid Deepening)',
        hoursAhead: -12,
        lat: 18.7,
        lon: 115.4,
        windKt: 95,
        windKmh: 176,
        pressureHpa: 952,
        category: 'Severe Typhoon',
        movement: 'WNW at 21 km/h',
        notes: 'Extreme ocean heat content (>120 kJ/cm²) triggering explosive deepening.'
      },
      {
        timeStep: 'T-6h (Category 4 Equivalent)',
        hoursAhead: -6,
        lat: 19.1,
        lon: 113.8,
        windKt: 110,
        windKmh: 204,
        pressureHpa: 940,
        category: 'Super Typhoon',
        movement: 'WNW at 21 km/h',
        notes: 'Pin-hole eye surrounded by ultra-deep convection of -85°C cloud tops.'
      }
    ],
    trackForecast: [
      {
        timeStep: 'T (Current)',
        hoursAhead: 0,
        lat: 19.4,
        lon: 112.5,
        windKt: 115,
        windKmh: 213,
        pressureHpa: 935,
        category: 'Super Typhoon',
        movement: 'WNW at 21 km/h',
        landfallStatus: 'Approaching Sea',
        notes: 'Symmetric stadium-effect eye with catastrophic eyewall lightning.'
      },
      {
        timeStep: 'T+8h',
        hoursAhead: 8,
        lat: 19.8,
        lon: 110.8,
        windKt: 120,
        windKmh: 222,
        pressureHpa: 930,
        category: 'Cat 4+ Landfall Hainan',
        movement: 'West at 20 km/h',
        landfallStatus: 'Severe Landfall',
        notes: 'Direct eyewall strike on northeast Hainan Island.'
      },
      {
        timeStep: 'T+24h',
        hoursAhead: 24,
        lat: 20.6,
        lon: 107.5,
        windKt: 85,
        windKmh: 157,
        pressureHpa: 960,
        category: 'Typhoon / Gulf of Tonkin',
        movement: 'WNW at 18 km/h',
        landfallStatus: 'Approaching Sea',
        notes: 'Crossing Gulf of Tonkin toward northern Vietnam.'
      },
      {
        timeStep: 'T+36h',
        hoursAhead: 36,
        lat: 21.1,
        lon: 105.8,
        windKt: 60,
        windKmh: 110,
        pressureHpa: 985,
        category: 'Severe Tropical Storm Landfall Vietnam',
        movement: 'West at 16 km/h',
        landfallStatus: 'Inland Weakening',
        notes: 'Second landfall near Haiphong; devastating inland river flooding.'
      }
    ]
  },
  {
    id: 'hurricane-helene',
    name: 'Hurricane HELENE',
    basinId: 'north-atlantic-caribbean',
    basinName: 'Caribbean Sea & Gulf of Mexico',
    status: 'Active',
    alertLevel: 'red',
    location: {
      lat: 24.5,
      lon: -86.1,
      distanceToCoastKm: 310,
      nearestLandmark: '310 km SW of Tampa Bay & 450 km S of Florida Big Bend'
    },
    impactRangeKm: 420,
    stormSizeKm: 680,
    eyeDiameterKm: 48,
    direction: 'NNE (020°)',
    headingAngleDeg: 20,
    forwardSpeedKmh: 34,
    intensity: {
      windKt: 120,
      windKmh: 222,
      gustsKmh: 260,
      categoryCode: 'Cat 4 Major',
      categoryName: 'Category 4 Major Hurricane (Saffir-Simpson)',
      dvorakTNumber: 6.0,
      ciNumber: 6.0,
      cloudTopTempC: -80,
      eyeTempC: 10,
      riProbabilityPct: 82,
      quadrantRadiiKm: {
        ne: 360,
        se: 320,
        sw: 240,
        nw: 280
      }
    },
    pressure: {
      centralPressureHpa: 938,
      pressureDropHpa: 72,
      ambientPressureHpa: 1010,
      dropPercentage: 7.12,
      deficitAnomalyPct: 95,
      barometricTrend: 'Plummeting (-4.6 hPa / 3h)',
      gradientHpaPerKm: 0.50
    },
    affectedAreas: {
      highAlertRed: {
        zoneName: 'Catastrophic Storm Surge Zone (Florida Big Bend)',
        districts: ['Taylor', 'Dixie', 'Levy', 'Wakulla', 'Franklin Counties'],
        populationAtRisk: '2.1 Million Citizens',
        actionRequired: 'MANDATORY LIFE-SAFETY EVACUATION. Unsurvivable storm surge anticipated. Curfew in effect.',
        expectedSurgeMeters: '4.5 to 6.0 meters (15-20 feet)',
        maxWindKmh: '200–230 km/h',
        sheltersOpen: 320
      },
      mediumAlertYellow: {
        zoneName: 'Major Inland Wind & Flood Corridor',
        districts: ['Tallahassee', 'Georgia (South & Central)', 'Western North Carolina (Appalachians)'],
        actionRequired: 'Preposition water rescue, prepare for days-long power outages, flash flood emergencies.',
        expectedSurgeMeters: '1.8 to 2.8 meters along Tampa Bay',
        maxWindKmh: '110–160 km/h',
        sheltersOpen: 210
      },
      leastAlertGreen: {
        zoneName: 'Outer Rainbands & Tornado Watch',
        districts: ['Central Florida', 'South Carolina', 'Eastern Tennessee'],
        actionRequired: 'Tornado watch active, stay off roads during localized squalls.',
        expectedSurgeMeters: '1.0 meter',
        maxWindKmh: '65–90 km/h',
        sheltersOpen: 95
      }
    },
    trackForecast: [
      {
        timeStep: 'T (Current)',
        hoursAhead: 0,
        lat: 24.5,
        lon: -86.1,
        windKt: 120,
        windKmh: 222,
        pressureHpa: 938,
        category: 'Cat 4 Major',
        movement: 'NNE at 34 km/h',
        landfallStatus: 'Approaching Sea',
        notes: 'Fast forward translation rate expanding destructive wind field eastward.'
      },
      {
        timeStep: 'T+10h',
        hoursAhead: 10,
        lat: 29.8,
        lon: -84.2,
        windKt: 125,
        windKmh: 231,
        pressureHpa: 934,
        category: 'Cat 4 Landfall Big Bend',
        movement: 'NNE at 36 km/h',
        landfallStatus: 'Severe Landfall',
        notes: 'Historic catastrophic surge in Apalachee Bay.'
      },
      {
        timeStep: 'T+24h',
        hoursAhead: 24,
        lat: 35.5,
        lon: -83.1,
        windKt: 50,
        windKmh: 92,
        pressureHpa: 982,
        category: 'Tropical Storm / Inland',
        movement: 'North at 28 km/h',
        landfallStatus: 'Inland Weakening',
        notes: 'Orographic precipitation enhancement triggering catastrophic mountain flooding.'
      }
    ]
  }
];

// Helper to compute distance between two lat/lon coordinates in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
