import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Waves, 
  Wind, 
  Thermometer, 
  Gauge, 
  AlertTriangle, 
  Share2, 
  MapPin, 
  Info, 
  ArrowUpRight, 
  CloudRain, 
  Globe2,
  Map as MapIcon
} from 'lucide-react';
import { SeaBasin, CycloneData, UserProfile } from '../types';
import { calculateDistanceKm } from '../data/vayuData';
import RotatingEarth from './ui/wireframe-dotted-globe';

interface WorldSeaMapProps {
  seas: SeaBasin[];
  cyclones: CycloneData[];
  userProfile: UserProfile;
  selectedSeaId: string | null;
  onSelectSea: (seaId: string) => void;
  onOpenShare: (cyclone: CycloneData, distanceKm: number) => void;
}

export const WorldSeaMap: React.FC<WorldSeaMapProps> = ({
  seas,
  cyclones,
  userProfile,
  selectedSeaId,
  onSelectSea,
  onOpenShare,
}) => {
  const [filterAlert, setFilterAlert] = useState<'all' | 'red' | 'yellow' | 'green'>('all');
  const [mapDisplayMode, setMapDisplayMode] = useState<'2d_radar' | '3d_globe'>('2d_radar');

  const selectedSea = seas.find((s) => s.id === selectedSeaId) || seas[0];
  const activeCyclone = cyclones.find((c) => c.basinId === selectedSea?.id || c.id === selectedSea?.activeCycloneId);

  // Approximate user location on SVG (India east coast approx x:67%, y:47%)
  const userMapX = Math.min(Math.max(((userProfile.lon + 180) / 360) * 100, 5), 95);
  const userMapY = Math.min(Math.max(((90 - userProfile.lat) / 180) * 100, 5), 95);

  const distanceToActiveCyclone = activeCyclone
    ? calculateDistanceKm(userProfile.lat, userProfile.lon, activeCyclone.location.lat, activeCyclone.location.lon)
    : undefined;

  const filteredSeas = seas.filter((sea) => {
    if (filterAlert === 'all') return true;
    return sea.alertLevel === filterAlert;
  });

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white/60 border border-white/75 backdrop-blur-2xl shadow-[0_8px_20px_rgba(13,71,21,0.04),inset_0_1px_1.5px_rgba(255,255,255,0.9)]">
        <div className="flex items-center space-x-2">
          <Compass className="h-4 w-4 text-[#41644A]" />
          <span className="text-xs font-bold text-[#0D4715]">
            World Oceanic Basins & Cyclone Identification Radar
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Display Mode Toggle: 2D Radar vs 3D Dotted Globe */}
          <div className="flex items-center bg-white/45 p-0.5 rounded-lg border border-white/70 text-xs backdrop-blur-md">
            <button
              onClick={() => setMapDisplayMode('2d_radar')}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-all flex items-center space-x-1 ${
                mapDisplayMode === '2d_radar'
                  ? 'bg-[#0D4715] text-[#EBE1D1] shadow-xs'
                  : 'text-[#0D4715] hover:bg-white/60'
              }`}
            >
              <MapIcon className="h-3 w-3" />
              <span>2D Radar</span>
            </button>
            <button
              onClick={() => setMapDisplayMode('3d_globe')}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-all flex items-center space-x-1 ${
                mapDisplayMode === '3d_globe'
                  ? 'bg-[#0D4715] text-[#EBE1D1] shadow-xs'
                  : 'text-[#0D4715] hover:bg-white/60'
              }`}
            >
              <Globe2 className="h-3 w-3" />
              <span>3D Dotted Globe</span>
            </button>
          </div>

          {/* Filter by Alert Level */}
          {mapDisplayMode === '2d_radar' && (
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-[11px] text-slate-600 font-medium hidden sm:inline">Alert Filter:</span>
              {(['all', 'red', 'yellow', 'green'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterAlert(level)}
                  className={`px-2 py-0.5 rounded-lg font-semibold text-[11px] transition-all capitalize ${
                    filterAlert === level
                      ? level === 'red'
                        ? 'bg-rose-700 text-white'
                        : level === 'yellow'
                        ? 'bg-amber-600 text-white'
                        : level === 'green'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#41644A] text-[#EBE1D1]'
                      : 'bg-white/50 text-[#0D4715] hover:bg-white/80 border border-white/60'
                  }`}
                >
                  {level === 'all' ? 'All' : `${level}`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3D Wireframe Dotted Globe View */}
      {mapDisplayMode === '3d_globe' ? (
        <div className="p-4 rounded-2xl bg-white/65 border border-white/80 shadow-[0_16px_40px_rgba(13,71,21,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h3 className="text-xs font-bold text-[#0D4715] uppercase tracking-wider">
                Interactive 3D Dotted Wireframe Earth
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-600 bg-white/60 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-white/80 shadow-xs">
              Orthographic Natural Earth Projection
            </span>
          </div>

          <RotatingEarth
            width={900}
            height={460}
            className="w-full"
            cyclones={cyclones}
            selectedCycloneId={activeCyclone?.id}
            onSelectCyclone={(cycloneId) => {
              const targetC = cyclones.find((c) => c.id === cycloneId);
              if (targetC && targetC.basinId) {
                onSelectSea(targetC.basinId);
              }
            }}
          />

          {/* Quick Basin Selector Pills below 3D Globe */}
          <div className="pt-2">
            <div className="text-xs font-bold text-[#0D4715] mb-2 flex items-center space-x-1.5">
              <span>Inspect Oceanic Basin:</span>
              <span className="text-[10px] text-slate-500 font-normal">(Click to view climatic prediction)</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {seas.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectSea(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 shadow-xs ${
                    selectedSea?.id === s.id
                      ? 'bg-[#0D4715] text-[#EBE1D1] ring-1 ring-[#0D4715]'
                      : 'bg-white/60 text-slate-800 hover:bg-white border border-white/80 backdrop-blur-sm'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      s.alertLevel === 'red'
                        ? 'bg-rose-500'
                        : s.alertLevel === 'yellow'
                        ? 'bg-amber-400'
                        : s.alertLevel === 'green'
                        ? 'bg-emerald-400'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span>{s.name.split('(')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 2D Interactive Global Oceanic Canvas with Framer Motion Markers */
        <div className="relative w-full aspect-[2/1] min-h-[350px] max-h-[500px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e273c] via-[#10344d] to-[#0c2033] border border-[#41644A]/40 shadow-xl select-none">
          {/* Subtle Latitude / Longitude Grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ocean-grid" width="10%" height="20%" patternUnits="userSpaceOnUse">
                <path d="M 0 0 L 100 0 M 0 0 L 0 100" fill="none" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="3 3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ocean-grid)" />
            {/* Equator line */}
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.6" />
            {/* Tropics */}
            <line x1="0" y1="37%" x2="100%" y2="37%" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5" />
            <line x1="0" y1="63%" x2="100%" y2="63%" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5" />
          </svg>

          {/* World Continents Vector Silhouette */}
          <svg
            viewBox="0 0 1000 500"
            className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* North America */}
            <path
              d="M 120,60 L 260,60 L 300,140 L 240,210 L 210,250 L 180,240 L 150,190 L 100,140 Z"
              fill="#2c4d40"
              stroke="#41644A"
              strokeWidth="1.2"
            />
            {/* South America */}
            <path
              d="M 230,260 L 320,290 L 310,380 L 270,460 L 240,420 L 220,330 Z"
              fill="#2c4d40"
              stroke="#41644A"
              strokeWidth="1.2"
            />
            {/* Europe & Africa */}
            <path
              d="M 460,70 L 580,70 L 560,160 L 600,210 L 590,320 L 540,410 L 480,390 L 460,260 L 440,160 Z"
              fill="#2c4d40"
              stroke="#41644A"
              strokeWidth="1.2"
            />
            {/* Asia & Indian Subcontinent */}
            <path
              d="M 580,70 L 890,70 L 870,220 L 800,250 L 730,270 L 680,290 L 630,230 L 600,160 Z"
              fill="#2c4d40"
              stroke="#41644A"
              strokeWidth="1.2"
            />
            {/* Australia & Oceania */}
            <path
              d="M 780,330 L 920,330 L 910,430 L 810,430 Z"
              fill="#2c4d40"
              stroke="#41644A"
              strokeWidth="1.2"
            />
            {/* Indian Ocean & Bay of Bengal Coastline Highlight */}
            <path
              d="M 640,210 L 670,260 L 690,240 L 720,270"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          </svg>

          {/* User Location Marker on Map with Framer Motion Drop & Pulse */}
          <motion.div
            initial={{ scale: 0, y: -25, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.2 }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${userMapX}%`, top: `${userMapY}%` }}
          >
            <div className="relative flex items-center justify-center">
              {/* Outer Pulsing Wave */}
              <motion.span
                animate={{
                  scale: [1, 2.2, 2.8],
                  opacity: [0.7, 0.25, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute h-7 w-7 rounded-full bg-amber-400"
              />
              <div className="h-4 w-4 rounded-full bg-amber-400 border-2 border-slate-900 shadow-lg flex items-center justify-center z-10">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-950"></div>
              </div>
              {/* Tooltip badge */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-950/90 text-amber-300 font-mono font-bold text-[10px] whitespace-nowrap shadow-md border border-amber-400/40 z-10">
                📍 You: {userProfile.city}
              </div>
            </div>
          </motion.div>

          {/* Interactive Sea & Cyclone Alert Color Dots with Framer Motion */}
          {filteredSeas.map((sea, index) => {
            const isSelected = selectedSea?.id === sea.id;
            const hasCyclone = !!sea.activeCycloneId;

            // Determine dot color styling based on alert level
            let dotColor = 'bg-slate-400 border-slate-200';
            let pulseColor = 'bg-slate-400/40';

            if (sea.alertLevel === 'red') {
              dotColor = 'bg-rose-600 border-white ring-2 ring-rose-400';
              pulseColor = 'bg-rose-500';
            } else if (sea.alertLevel === 'yellow') {
              dotColor = 'bg-amber-500 border-white ring-2 ring-amber-300';
              pulseColor = 'bg-amber-400';
            } else if (sea.alertLevel === 'green') {
              dotColor = 'bg-emerald-500 border-white';
              pulseColor = 'bg-emerald-400';
            }

            return (
              <motion.div
                key={sea.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 20,
                  delay: 0.1 + index * 0.06,
                }}
                onClick={() => onSelectSea(sea.id)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${sea.svgX}%`, top: `${sea.svgY}%` }}
                title={`Click to inspect ${sea.name} climatic predictions`}
              >
                <div className="relative flex items-center justify-center">
                  {/* Framer Motion Multi-ring Radar Pulse for Warning Basins */}
                  {sea.alertLevel !== 'none' && (
                    <>
                      <motion.span
                        animate={{
                          scale: [1, 2.2, 3.0],
                          opacity: [0.8, 0.35, 0],
                        }}
                        transition={{
                          duration: sea.alertLevel === 'red' ? 1.6 : 2.4,
                          repeat: Infinity,
                          ease: 'easeOut',
                        }}
                        className={`absolute h-7 w-7 rounded-full ${pulseColor} opacity-70`}
                      />
                      {sea.alertLevel === 'red' && (
                        <motion.span
                          animate={{
                            scale: [1, 1.8, 2.4],
                            opacity: [0.6, 0.2, 0],
                          }}
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            delay: 0.5,
                            ease: 'easeOut',
                          }}
                          className={`absolute h-7 w-7 rounded-full ${pulseColor}`}
                        />
                      )}
                    </>
                  )}

                  {/* Cyclone Vortex Icon with Smooth Framer Motion Spin & Initial Entrance */}
                  {hasCyclone && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{
                        scale: { duration: 0.4, delay: 0.3 + index * 0.05 },
                        rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
                      }}
                      className="absolute -top-3.5 -right-3.5 h-5 w-5 rounded-full bg-rose-950/90 border border-rose-400 text-rose-300 flex items-center justify-center shadow-md z-20"
                    >
                      <Wind className="h-3 w-3" />
                    </motion.div>
                  )}

                  {/* The Color Dot Indicator with Hover & Active Scale */}
                  <motion.div
                    whileHover={{ scale: 1.4 }}
                    whileTap={{ scale: 0.9 }}
                    className={`h-4 w-4 rounded-full ${dotColor} shadow-lg transition-all ${
                      isSelected ? 'scale-135 ring-4 ring-sky-300' : ''
                    }`}
                  />

                  {/* Name Label Badge */}
                  <div
                    className={`absolute top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] whitespace-nowrap shadow-lg backdrop-blur-md transition-all pointer-events-none z-10 ${
                      isSelected
                        ? 'bg-slate-900 text-white font-bold border border-sky-400 ring-2 ring-sky-400/30'
                        : 'bg-slate-950/80 text-slate-200 border border-slate-700/80 group-hover:bg-slate-900 group-hover:text-white'
                    }`}
                  >
                    <span className="font-semibold">{sea.name.split('(')[0]}</span>
                    {hasCyclone && <span className="ml-1 text-rose-400 font-mono">⚠️</span>}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Map Legend Overlay */}
          <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 border border-slate-700/80 backdrop-blur-md text-[10px] text-slate-300 font-mono">
            <span className="text-slate-400 font-sans font-semibold">Alert Range:</span>
            <div className="flex items-center space-x-1">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-600 ring-1 ring-white animate-pulse"></span>
              <span className="text-rose-300 font-bold">Red (Severe Storm)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-1 ring-white"></span>
              <span className="text-amber-300 font-semibold">Yellow (Gale Alert)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1 ring-white"></span>
              <span className="text-emerald-300">Green (Advisory)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span>
              <span className="text-slate-300">Normal Sea</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Sea Basin Inspector Card & Climate Prediction with Frosted Glass Transparency */}
      {selectedSea && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSea.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="p-5 rounded-2xl bg-white/65 border border-white/80 shadow-[0_16px_40px_rgba(13,71,21,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-2xl space-y-4"
          >
            {/* Basin Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/60">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`h-4 w-4 rounded-full ${
                    selectedSea.alertLevel === 'red'
                      ? 'bg-rose-600 ring-2 ring-rose-300 animate-pulse'
                      : selectedSea.alertLevel === 'yellow'
                      ? 'bg-amber-500'
                      : selectedSea.alertLevel === 'green'
                      ? 'bg-emerald-500'
                      : 'bg-slate-400'
                  }`}
                />
                <div>
                  <h3 className="text-base font-extrabold text-[#0D4715] flex items-center space-x-2">
                    <span>{selectedSea.name}</span>
                    <span className="text-xs font-mono font-normal text-slate-600">
                      ({selectedSea.lat}°N, {selectedSea.lon}°E)
                    </span>
                  </h3>
                  <span className="text-[11px] text-[#41644A] font-semibold">
                    Climatic Surveillance & 72-Hour Marine Prediction
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {selectedSea.alertLevel === 'red' ? (
                  <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-900 border border-rose-400/40 backdrop-blur-sm text-xs font-bold font-mono">
                    HIGH CYCLONE ALERT ACTIVE
                  </span>
                ) : selectedSea.alertLevel === 'yellow' ? (
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 border border-amber-400/40 backdrop-blur-sm text-xs font-bold font-mono">
                    MEDIUM GALE WARNING
                  </span>
                ) : selectedSea.alertLevel === 'green' ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-900 border border-emerald-400/40 backdrop-blur-sm text-xs font-bold font-mono">
                    MONITORED ADVISORY
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-white/60 text-slate-700 border border-white/80 backdrop-blur-sm text-xs font-medium font-mono">
                    CALM METEOROLOGICAL STATE
                  </span>
                )}
              </div>
            </div>

            {/* If Cyclone is Occurring in this Sea Basin */}
            {activeCyclone && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-500/15 via-amber-500/10 to-rose-500/15 backdrop-blur-xl border border-rose-400/50 space-y-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-rose-600 animate-bounce" />
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 block">
                        Cyclone Occurrence Detected in this Sea
                      </span>
                      <h4 className="text-base font-extrabold text-rose-950">
                        {activeCyclone.name} ({activeCyclone.category})
                      </h4>
                    </div>
                  </div>

                  {/* Share Alert to Contacts button */}
                  <button
                    onClick={() => onOpenShare(activeCyclone, distanceToActiveCyclone || 0)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Share Cyclone Alert to Contacts</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-white/70 backdrop-blur-sm border border-rose-200">
                    <span className="text-[10px] text-slate-600 block">Intensity (Winds):</span>
                    <span className="text-sm font-extrabold text-rose-700">
                      {activeCyclone.intensity.windKmh} km/h
                    </span>{' '}
                    <span className="text-[10px] text-slate-600">({activeCyclone.intensity.windKt} kt)</span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/70 backdrop-blur-sm border border-rose-200">
                    <span className="text-[10px] text-slate-600 block">Translation Speed:</span>
                    <span className="text-sm font-extrabold text-[#0D4715]">
                      {activeCyclone.forwardSpeedKmh} km/h
                    </span>{' '}
                    <span className="text-[10px] text-slate-600">({activeCyclone.direction})</span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/70 backdrop-blur-sm border border-rose-200">
                    <span className="text-[10px] text-slate-600 block">Central Pressure:</span>
                    <span className="text-sm font-extrabold text-slate-800">
                      {activeCyclone.pressure.centralPressureHpa} hPa
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/70 backdrop-blur-sm border border-rose-200">
                    <span className="text-[10px] text-slate-600 block">Distance to You:</span>
                    <span className="text-sm font-extrabold text-indigo-700">
                      {distanceToActiveCyclone !== undefined ? `${distanceToActiveCyclone} km` : 'Calculating...'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Climatic Conditions & Prediction */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0D4715] uppercase tracking-wider block">
                Regular Climatic Baseline & Oceanic Indices
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* SST */}
                <div className="p-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/70 space-y-1 shadow-xs">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Thermometer className="h-4 w-4 text-rose-600" />
                    <span className="font-semibold text-[11px]">Sea Surface Temp</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-[#0D4715]">
                    {selectedSea.sstCelsius ?? 28.5}°C
                  </div>
                  <span className="text-[10px] text-slate-600 block">
                    Threshold: {(selectedSea.sstCelsius ?? 28) >= 28 ? '🔥 High Cyclogenesis (>28°C)' : 'Stable (<28°C)'}
                  </span>
                </div>

                {/* Surface Winds */}
                <div className="p-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/70 space-y-1 shadow-xs">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Wind className="h-4 w-4 text-sky-700" />
                    <span className="font-semibold text-[11px]">Surface Winds</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-[#0D4715]">
                    {selectedSea.surfaceWindKmh ?? 45} <span className="text-xs">km/h</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {selectedSea.surfaceWindKt ?? 24} knots sustained
                  </span>
                </div>

                {/* Wave Height */}
                <div className="p-3 rounded-xl bg-[#EBE1D1]/60 border border-[#41644A]/25 space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Waves className="h-4 w-4 text-teal-700" />
                    <span className="font-semibold text-[11px]">Significant Swell</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-[#0D4715]">
                    {selectedSea.waveHeightM ?? 2.5} <span className="text-xs">meters</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {(selectedSea.waveHeightM ?? 2) > 3 ? '⚠️ Dangerous Marine Swell' : 'Moderate Marine Sea'}
                  </span>
                </div>

                {/* Pressure */}
                <div className="p-3 rounded-xl bg-[#EBE1D1]/60 border border-[#41644A]/25 space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Gauge className="h-4 w-4 text-[#41644A]" />
                    <span className="font-semibold text-[11px]">Barometric MSLP</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-[#0D4715]">
                    {selectedSea.pressureHpa ?? 1008} <span className="text-xs">hPa</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Humidity: {selectedSea.humidityPct ?? 80}%
                  </span>
                </div>
              </div>
            </div>

            {/* 72h Prediction Outlook */}
            <div className="p-3.5 rounded-xl bg-[#EBE1D1]/40 border border-[#41644A]/20 flex items-start space-x-2.5 text-xs">
              <CloudRain className="h-4 w-4 text-[#41644A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0D4715]">72-Hour Climate Outlook & Cyclogenesis Outlook:</span>
                <p className="text-slate-700 mt-0.5 leading-relaxed font-sans">
                  {selectedSea.climatePrediction ?? selectedSea.synopticSummary ?? 'Normal seasonal conditions observed across basin.'}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
