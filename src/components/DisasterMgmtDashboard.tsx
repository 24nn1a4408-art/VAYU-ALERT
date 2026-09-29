import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Compass, 
  MapPin, 
  Wind, 
  Gauge, 
  ArrowUpRight, 
  Activity, 
  Radio, 
  Users, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Share2,
  FileText
} from 'lucide-react';
import { CycloneData } from '../types';

interface DisasterMgmtDashboardProps {
  cyclones: CycloneData[];
  selectedCycloneId: string;
  onSelectCyclone: (id: string) => void;
  onOpenClassification: (tab: 'intensity' | 'pressure') => void;
  onOpenShare: (cyclone: CycloneData, distanceKm: number) => void;
}

export const DisasterMgmtDashboard: React.FC<DisasterMgmtDashboardProps> = ({
  cyclones,
  selectedCycloneId,
  onSelectCyclone,
  onOpenClassification,
  onOpenShare,
}) => {
  const [pressureMode, setPressureMode] = useState<1 | 2 | 3>(1);
  const [activeZoneTab, setActiveZoneTab] = useState<'red' | 'yellow' | 'green'>('red');
  const [dispatchAlertSent, setDispatchAlertSent] = useState(false);

  const cyclone = cyclones.find((c) => c.id === selectedCycloneId) || cyclones[0];

  const handleSendDispatch = () => {
    setDispatchAlertSent(true);
    setTimeout(() => setDispatchAlertSent(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* 1. COMMAND HEADER & CYCLONE SELECTOR with Frosted Glass Transparency */}
      <div className="p-5 rounded-2xl bg-white/65 border border-white/80 shadow-[0_16px_40px_rgba(13,71,21,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/60">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-[#0D4715] flex items-center justify-center text-amber-300 shadow-sm">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700">
                  Disaster Management Authority & NDRF Ops
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-900 font-bold font-mono border border-rose-400/40 backdrop-blur-sm">
                  User 2 Command Portal
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-[#0D4715]">
                Cyclone Early Warning, Zonation & Telemetry Desk
              </h2>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenShare(cyclone, 0)}
              className="px-3 py-1.5 rounded-xl bg-white/60 hover:bg-white/85 backdrop-blur-md border border-white/80 text-xs font-semibold text-[#0D4715] transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <Share2 className="h-3.5 w-3.5 text-[#41644A]" />
              <span>Broadcast SITREP</span>
            </button>

            <button
              onClick={handleSendDispatch}
              disabled={dispatchAlertSent}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 ${
                dispatchAlertSent
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#41644A]/90 hover:bg-[#0D4715] text-[#EBE1D1] backdrop-blur-md border border-white/20'
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              <span>{dispatchAlertSent ? 'Evacuation Order Dispatched!' : 'Transmit NDRF Order'}</span>
            </button>
          </div>
        </div>

        {/* Storm Selector Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-600 shrink-0">Monitored Systems:</span>
          {cyclones.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCyclone(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center space-x-2 ${
                cyclone.id === c.id
                  ? 'bg-[#0D4715] text-[#EBE1D1] shadow-sm ring-1 ring-[#0D4715]'
                  : 'bg-white/50 text-slate-700 hover:bg-white/80 border border-white/60 backdrop-blur-sm'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  c.alertLevel === 'red'
                    ? 'bg-rose-500 animate-pulse'
                    : c.alertLevel === 'yellow'
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              />
              <span>{c.name} ({c.basinName.split('(')[0]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. CYCLONE IDENTIFICATION PARAMETERS with Frosted Glass Transparency */}
      <div className="p-5 rounded-2xl bg-white/65 border border-white/80 shadow-[0_16px_40px_rgba(13,71,21,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="h-4 w-4 text-[#41644A]" />
            <h3 className="text-xs font-bold text-[#0D4715] uppercase tracking-wider">
              1. Cyclone Identification & Spatial Dynamics
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#0D4715] bg-white/60 px-2.5 py-0.5 rounded-full border border-white/80 backdrop-blur-sm shadow-xs">
            Status: {cyclone.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Location */}
          <div className="p-3.5 rounded-xl bg-white/50 backdrop-blur-md border border-white/70 space-y-1 shadow-xs">
            <div className="flex items-center space-x-1 text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-rose-600" />
              <span className="font-semibold text-[11px]">Cyclone Location</span>
            </div>
            <div className="text-base font-bold font-mono text-[#0D4715]">
              {cyclone.location.lat}°N, {cyclone.location.lon}°E
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              {cyclone.location.nearestLandmark} ({cyclone.location.distanceToCoastKm} km to coast)
            </p>
          </div>

          {/* Range */}
          <div className="p-3.5 rounded-xl bg-white/50 backdrop-blur-md border border-white/70 space-y-1 shadow-xs">
            <div className="flex items-center space-x-1 text-slate-600">
              <Maximize2 className="h-3.5 w-3.5 text-amber-700" />
              <span className="font-semibold text-[11px]">Cyclone Alert Range</span>
            </div>
            <div className="text-base font-bold font-mono text-[#0D4715]">
              {cyclone.impactRangeKm} <span className="text-xs font-normal">km radius</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Total gale-force wind envelope & high swell impact radius
            </p>
          </div>

          {/* Size */}
          <div className="p-3.5 rounded-xl bg-white/50 backdrop-blur-md border border-white/70 space-y-1 shadow-xs">
            <div className="flex items-center space-x-1 text-slate-600">
              <Activity className="h-3.5 w-3.5 text-indigo-700" />
              <span className="font-semibold text-[11px]">Cyclone Size</span>
            </div>
            <div className="text-base font-bold font-mono text-[#0D4715]">
              {cyclone.stormSizeKm} <span className="text-xs font-normal">km diameter</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Eye diameter: <strong>{cyclone.eyeDiameterKm} km</strong> (Stadium-effect eyewall)
            </p>
          </div>

          {/* Direction & Speed */}
          <div className="p-3.5 rounded-xl bg-white/50 backdrop-blur-md border border-white/70 space-y-1 shadow-xs">
            <div className="flex items-center space-x-1 text-slate-600">
              <Compass className="h-3.5 w-3.5 text-[#41644A]" />
              <span className="font-semibold text-[11px]">Cyclone Direction</span>
            </div>
            <div className="text-base font-bold font-mono text-[#0D4715]">
              {cyclone.direction}
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Translation velocity: <strong>{cyclone.forwardSpeedKmh} km/h</strong> ({cyclone.headingAngleDeg}°)
            </p>
          </div>
        </div>
      </div>

      {/* 3. AFFECTED AREA ZONATION (RED, YELLOW, GREEN) with Frosted Glass Transparency */}
      <div className="p-5 rounded-2xl bg-white/65 border border-white/80 shadow-[0_16px_40px_rgba(13,71,21,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            <h3 className="text-xs font-bold text-[#0D4715] uppercase tracking-wider">
              2. Affected Area Zonation & Evacuation Protocol
            </h3>
          </div>

          {/* Zonation Tabs */}
          <div className="flex items-center space-x-1 bg-white/45 p-1 rounded-xl border border-white/70 backdrop-blur-md">
            <button
              onClick={() => setActiveZoneTab('red')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeZoneTab === 'red'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-rose-950 hover:bg-white/60'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-rose-400"></span>
              <span>1. High Alert (Red)</span>
            </button>

            <button
              onClick={() => setActiveZoneTab('yellow')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeZoneTab === 'yellow'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-950 hover:bg-white/60'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-300"></span>
              <span>2. Medium Alert (Yellow)</span>
            </button>

            <button
              onClick={() => setActiveZoneTab('green')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeZoneTab === 'green'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-950 hover:bg-white/60'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
              <span>3. Least Alert (Green)</span>
            </button>
          </div>
        </div>

        {/* Selected Zone Card Details */}
        {activeZoneTab === 'red' && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-rose-500/15 backdrop-blur-xl border border-rose-300/60 text-rose-950 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-rose-300/40">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-rose-700 block">
                  Priority 1 Disaster Zone
                </span>
                <h4 className="text-base font-extrabold text-rose-950">
                  {cyclone.affectedAreas.highAlertRed.zoneName}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-rose-700 text-white font-mono font-bold text-xs">
                  Max Winds: {cyclone.affectedAreas.highAlertRed.maxWindKmh}
                </span>
                <span className="px-2.5 py-1 rounded bg-white/70 backdrop-blur-sm text-rose-900 border border-rose-300/50 font-mono text-xs">
                  Surge: {cyclone.affectedAreas.highAlertRed.expectedSurgeMeters}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-rose-200">
                <span className="font-bold text-rose-900 block mb-1">Key Impact Districts:</span>
                <div className="flex flex-wrap gap-1">
                  {cyclone.affectedAreas.highAlertRed.districts.map((d) => (
                    <span key={d} className="px-2 py-0.5 rounded bg-rose-100 font-semibold text-rose-900">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-rose-200">
                <span className="font-bold text-rose-900 block mb-1">Population & Shelters:</span>
                <p className="text-slate-700">
                  At Risk: <strong>{cyclone.affectedAreas.highAlertRed.populationAtRisk}</strong><br />
                  Shelters Active: <strong>{cyclone.affectedAreas.highAlertRed.sheltersOpen} units</strong>
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-rose-200">
                <span className="font-bold text-rose-900 block mb-1">Mandatory Command Action:</span>
                <p className="text-rose-950 font-medium leading-relaxed">
                  {cyclone.affectedAreas.highAlertRed.actionRequired}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeZoneTab === 'yellow' && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/15 backdrop-blur-xl border border-amber-300/60 text-amber-950 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-300/40">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-700 block">
                  Priority 2 Preparedness Zone
                </span>
                <h4 className="text-base font-extrabold text-amber-950">
                  {cyclone.affectedAreas.mediumAlertYellow.zoneName}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-amber-600 text-white font-mono font-bold text-xs">
                  Max Winds: {cyclone.affectedAreas.mediumAlertYellow.maxWindKmh}
                </span>
                <span className="px-2.5 py-1 rounded bg-white/70 backdrop-blur-sm text-amber-900 border border-amber-300/50 font-mono text-xs">
                  Surge: {cyclone.affectedAreas.mediumAlertYellow.expectedSurgeMeters}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">Impact Districts:</span>
                <div className="flex flex-wrap gap-1">
                  {cyclone.affectedAreas.mediumAlertYellow.districts.map((d) => (
                    <span key={d} className="px-2 py-0.5 rounded bg-amber-100 font-semibold text-amber-900">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">Action Protocol:</span>
                <p className="text-slate-700 leading-relaxed">
                  {cyclone.affectedAreas.mediumAlertYellow.actionRequired}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeZoneTab === 'green' && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-emerald-500/15 backdrop-blur-xl border border-emerald-300/60 text-emerald-950 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-300/40">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-700 block">
                  Priority 3 Advisory Zone
                </span>
                <h4 className="text-base font-extrabold text-emerald-950">
                  {cyclone.affectedAreas.leastAlertGreen.zoneName}
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-700 text-white font-mono font-bold text-xs">
                Winds: {cyclone.affectedAreas.leastAlertGreen.maxWindKmh}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-1">Advisory Districts:</span>
                <div className="flex flex-wrap gap-1">
                  {cyclone.affectedAreas.leastAlertGreen.districts.map((d) => (
                    <span key={d} className="px-2 py-0.5 rounded bg-emerald-100 font-semibold text-emerald-900">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-1">Action Protocol:</span>
                <p className="text-slate-700 leading-relaxed">
                  {cyclone.affectedAreas.leastAlertGreen.actionRequired}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. METEOROLOGICAL TELEMETRY: INTENSITY, SPEED, PRESSURE (3 MODES & %) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-[#41644A]" />
            <h3 className="text-xs font-bold text-[#0D4715] uppercase tracking-wider">
              3. Telemetry: Intensity, Speed & Pressure Dynamics
            </h3>
          </div>
          <span className="text-[11px] text-[#41644A] italic">
            💡 Click on Intensity or Pressure card to open classification deep-dive
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* A. INTENSITY CARD (CLICKABLE) */}
          <div
            onClick={() => onOpenClassification('intensity')}
            className="p-4 rounded-2xl bg-white/65 border border-white/80 shadow-[0_16px_40px_rgba(13,71,21,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-2xl hover:border-[#0D4715] hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/60">
              <div className="flex items-center space-x-1.5 text-[#0D4715]">
                <Wind className="h-4 w-4 text-[#41644A] group-hover:rotate-45 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-wider">Intensity in Values</span>
              </div>
              <div className="flex items-center space-x-1 text-[11px] font-bold text-[#41644A] group-hover:text-[#0D4715]">
                <span>Classification Deep-Dive</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold font-mono text-[#0D4715]">
                  {cyclone.intensity.windKmh}
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">km/h</span>
                <span className="text-sm font-bold text-[#41644A] font-mono">
                  ({cyclone.intensity.windKt} knots)
                </span>
              </div>

              <div className="p-2 rounded-xl bg-white/50 backdrop-blur-md border border-white/70 text-xs shadow-xs">
                <div className="font-bold text-[#0D4715]">{cyclone.intensity.categoryName}</div>
                <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                  Peak Gusts: {cyclone.intensity.gustsKmh} km/h • Dvorak T{cyclone.intensity.dvorakTNumber}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-600">
                <span>RI Probability: <strong>{cyclone.intensity.riProbabilityPct}%</strong></span>
                <span className="text-[#0D4715] font-semibold underline group-hover:no-underline">
                  Inspect Satellite IR →
                </span>
              </div>
            </div>
          </div>

          {/* B. SPEED CARD */}
          <div className="p-4 rounded-2xl bg-white/65 border border-white/80 shadow-[0_16px_40px_rgba(13,71,21,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/60">
              <div className="flex items-center space-x-1.5 text-[#0D4715]">
                <Compass className="h-4 w-4 text-[#41644A]" />
                <span className="text-xs font-bold uppercase tracking-wider">Speed & Forward Motion</span>
              </div>
              <span className="text-[10px] font-mono text-slate-600 bg-white/60 px-2 py-0.5 rounded border border-white/80 backdrop-blur-sm">
                Translation
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold font-mono text-[#0D4715]">
                  {cyclone.forwardSpeedKmh}
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">km/h</span>
                <span className="text-sm font-bold text-[#41644A] font-mono">
                  ({Math.round(cyclone.forwardSpeedKmh / 1.852)} kt)
                </span>
              </div>

              <div className="p-2 rounded-xl bg-white/50 backdrop-blur-md border border-white/70 text-xs space-y-1 shadow-xs">
                <div className="text-slate-700">
                  Steering Vector: <strong>{cyclone.direction} ({cyclone.headingAngleDeg}°)</strong>
                </div>
                <div className="text-[11px] text-slate-600">
                  Landfall ETA: <strong>~18 Hours</strong> (Subtropical ridge steering)
                </div>
              </div>

              <div className="text-[11px] text-slate-600 font-mono">
                Speed category: {cyclone.forwardSpeedKmh > 25 ? 'Rapid Translator' : 'Standard Coastal Approach'}
              </div>
            </div>
          </div>

          {/* C. PRESSURE CARD (3 MODES & PERCENTAGE - CLICKABLE) */}
          <div className="p-4 rounded-2xl bg-white/65 border border-white/80 shadow-[0_16px_40px_rgba(13,71,21,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/60">
              <div
                onClick={() => onOpenClassification('pressure')}
                className="flex items-center space-x-1.5 text-[#0D4715] cursor-pointer group"
              >
                <Gauge className="h-4 w-4 text-[#41644A] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-wider">Pressure: 3 Modes</span>
              </div>
              <button
                onClick={() => onOpenClassification('pressure')}
                className="flex items-center space-x-1 text-[11px] font-bold text-[#41644A] hover:text-[#0D4715]"
              >
                <span>Barometric Model</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            {/* 3 Modes Selector Switch */}
            <div className="grid grid-cols-3 gap-1 bg-white/45 p-1 rounded-xl border border-white/70 text-[10px] font-bold font-mono backdrop-blur-sm">
              <button
                onClick={() => setPressureMode(1)}
                className={`py-1 rounded-lg transition-all ${
                  pressureMode === 1 ? 'bg-[#0D4715] text-[#EBE1D1] shadow-xs' : 'text-slate-700 hover:bg-white/60'
                }`}
              >
                Mode 1: Central
              </button>
              <button
                onClick={() => setPressureMode(2)}
                className={`py-1 rounded-lg transition-all ${
                  pressureMode === 2 ? 'bg-[#0D4715] text-[#EBE1D1] shadow-xs' : 'text-slate-700 hover:bg-white/60'
                }`}
              >
                Mode 2: Drop ΔP
              </button>
              <button
                onClick={() => setPressureMode(3)}
                className={`py-1 rounded-lg transition-all ${
                  pressureMode === 3 ? 'bg-[#0D4715] text-[#EBE1D1] shadow-xs' : 'text-slate-700 hover:bg-white/60'
                }`}
              >
                Mode 3: Ambient
              </button>
            </div>

            {/* Value Display Based on Selected Mode */}
            <div
              onClick={() => onOpenClassification('pressure')}
              className="cursor-pointer group space-y-1.5"
            >
              {pressureMode === 1 && (
                <div>
                  <span className="text-[10px] text-slate-500 block">Mode 1: Central Pressure (Pc)</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold font-mono text-[#0D4715]">
                      {cyclone.pressure.centralPressureHpa}
                    </span>
                    <span className="text-xs font-mono text-slate-500">hPa</span>
                  </div>
                </div>
              )}

              {pressureMode === 2 && (
                <div>
                  <span className="text-[10px] text-slate-500 block">Mode 2: Pressure Drop (ΔP)</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold font-mono text-rose-700">
                      {cyclone.pressure.pressureDropHpa}
                    </span>
                    <span className="text-xs font-mono text-rose-700">hPa drop</span>
                  </div>
                </div>
              )}

              {pressureMode === 3 && (
                <div>
                  <span className="text-[10px] text-slate-500 block">Mode 3: Outer Ambient Peripheral Pressure</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold font-mono text-slate-800">
                      {cyclone.pressure.ambientPressureHpa}
                    </span>
                    <span className="text-xs font-mono text-slate-500">hPa baseline</span>
                  </div>
                </div>
              )}

              {/* Barometric Percentage Deficit */}
              <div className="p-2 rounded-xl bg-white/50 backdrop-blur-md border border-white/70 flex items-center justify-between text-xs font-mono shadow-xs">
                <span>Drop Percentage:</span>
                <span className="font-bold text-rose-700">
                  -{cyclone.pressure.dropPercentage}% ({cyclone.pressure.deficitAnomalyPct}% severity index)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TRACK FORECASTING */}
      <div className="p-5 rounded-2xl bg-white/65 border border-white/80 shadow-[0_16px_40px_rgba(13,71,21,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-[#41644A]" />
            <h3 className="text-xs font-bold text-[#0D4715] uppercase tracking-wider">
              4. Track Forecasting Waypoints & Cone of Uncertainty
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#0D4715] bg-white/60 px-2.5 py-0.5 rounded-full border border-white/80 backdrop-blur-sm shadow-xs">
            IMD & JTWC Ensemble Trajectory
          </span>
        </div>

        {/* Waypoint Table */}
        <div className="overflow-x-auto rounded-xl border border-white/70 backdrop-blur-md">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#41644A] text-[#EBE1D1] font-bold">
              <tr>
                <th className="p-3">Forecast Step</th>
                <th className="p-3">Position</th>
                <th className="p-3">Wind (kt / km/h)</th>
                <th className="p-3">Pressure</th>
                <th className="p-3">Classification</th>
                <th className="p-3">Landfall Status</th>
                <th className="p-3">Operational Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#41644A]/15 bg-white/75 backdrop-blur-md">
              {cyclone.trackForecast.map((waypoint, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-white/90 transition-colors ${
                    waypoint.landfallStatus === 'Severe Landfall'
                      ? 'bg-rose-500/10 font-semibold text-rose-950'
                      : ''
                  }`}
                >
                  <td className="p-3 font-mono font-bold whitespace-nowrap text-[#0D4715]">
                    {waypoint.timeStep}
                  </td>
                  <td className="p-3 font-mono whitespace-nowrap">
                    {waypoint.lat}°N, {waypoint.lon}°E
                  </td>
                  <td className="p-3 font-mono whitespace-nowrap">
                    <strong className="text-rose-700">{waypoint.windKmh} km/h</strong>{' '}
                    <span className="text-slate-500">({waypoint.windKt} kt)</span>
                  </td>
                  <td className="p-3 font-mono whitespace-nowrap">
                    {waypoint.pressureHpa} hPa
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-white/80 text-[#0D4715] font-semibold text-[11px] border border-white/80">
                      {waypoint.category}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        waypoint.landfallStatus === 'Severe Landfall'
                          ? 'bg-rose-700 text-white animate-pulse'
                          : waypoint.landfallStatus === 'Coastal Proximity'
                          ? 'bg-amber-500 text-white'
                          : 'bg-white/70 text-slate-700 border border-white/80'
                      }`}
                    >
                      {waypoint.landfallStatus}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 text-[11px] min-w-[200px]">
                    {waypoint.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
