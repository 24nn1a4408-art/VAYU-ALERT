import React, { useState } from 'react';
import { MapPin, AlertTriangle, Share2, Compass, Shield, Users, Radio, Navigation, CheckCircle2, ChevronRight, PhoneCall } from 'lucide-react';
import { CycloneData, SeaBasin, UserProfile } from '../types';
import { WorldSeaMap } from './WorldSeaMap';
import { calculateDistanceKm, POPULAR_COASTAL_LOCATIONS } from '../data/vayuData';

interface CitizenDashboardProps {
  userProfile: UserProfile;
  cyclones: CycloneData[];
  seas: SeaBasin[];
  onOpenProfile: () => void;
  onOpenShare: (cyclone: CycloneData, distanceKm: number) => void;
  onUpdateLocation: (city: string, lat: number, lon: number) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  userProfile,
  cyclones,
  seas,
  onOpenProfile,
  onOpenShare,
  onUpdateLocation,
}) => {
  const [selectedSeaId, setSelectedSeaId] = useState<string>('bay-of-bengal');
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Find nearest active cyclone to user
  let nearestCyclone: CycloneData | null = null;
  let minDistance = Infinity;

  cyclones.forEach((cyclone) => {
    const dist = calculateDistanceKm(
      userProfile.lat,
      userProfile.lon,
      cyclone.location.lat,
      cyclone.location.lon
    );
    if (dist < minDistance) {
      minDistance = dist;
      nearestCyclone = cyclone;
    }
  });

  // Check if user is in immediate alert range
  const isThreatened = nearestCyclone && minDistance <= ((nearestCyclone as CycloneData).impactRangeKm + 150);

  // Request browser geolocation
  const handleDetectLocation = () => {
    setGeoLocating(true);
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      setGeoLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onUpdateLocation(`GPS (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`, latitude, longitude);
        setGeoLocating(false);
      },
      (err) => {
        setGeoError(`Location access denied (${err.message}). Using preset coastal city.`);
        setGeoLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. CITIZEN PROXIMITY & CYCLONE ALERT BANNER */}
      <div className="p-5 rounded-2xl bg-white/65 border border-white/80 shadow-[0_16px_40px_rgba(13,71,21,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/60">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-[#41644A] flex items-center justify-center text-[#EBE1D1] shadow-sm">
              <Navigation className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#41644A]">
                  Citizen Safety Shield
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/60 backdrop-blur-sm text-[#0D4715] font-bold font-mono border border-white/80">
                  User 1 Portal
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-[#0D4715]">
                Coastal Proximity & Live Cyclone Advisory
              </h2>
            </div>
          </div>

          {/* User Location Pill with Quick Geolocation button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/55 backdrop-blur-md border border-white/75 text-xs font-medium text-[#0D4715] shadow-xs">
              <MapPin className="h-4 w-4 text-rose-600 shrink-0" />
              <span>Registered: <strong>{userProfile.city}</strong></span>
            </div>

            <button
              onClick={handleDetectLocation}
              disabled={geoLocating}
              className="px-3 py-1.5 rounded-xl bg-white/60 hover:bg-white/85 backdrop-blur-md border border-white/80 text-xs font-semibold text-[#0D4715] transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <Radio className={`h-3.5 w-3.5 text-[#41644A] ${geoLocating ? 'animate-spin' : ''}`} />
              <span>{geoLocating ? 'Detecting GPS...' : 'Detect My Location'}</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="px-3 py-1.5 rounded-xl bg-[#41644A]/90 hover:bg-[#0D4715] backdrop-blur-md border border-white/30 text-[#EBE1D1] text-xs font-bold transition-colors shadow-xs"
            >
              Edit Profile & Contacts
            </button>
          </div>
        </div>

        {geoError && (
          <div className="p-2.5 rounded-lg bg-amber-500/15 backdrop-blur-md border border-amber-400/40 text-[11px] text-amber-900">
            {geoError}
          </div>
        )}

        {/* PROXIMITY ALERT NOTIFICATION */}
        {isThreatened && nearestCyclone ? (
          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-500/15 via-rose-400/10 to-amber-500/15 backdrop-blur-xl border border-rose-400/60 shadow-[0_8px_20px_rgba(244,63,94,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0 shadow-md">
                <AlertTriangle className="h-6 w-6 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-rose-700 text-white font-mono text-[10px] font-bold tracking-wide">
                    HIGH CYCLONE ALERT
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-900">
                    Proximity Threat: {minDistance} km
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-rose-950">
                  {nearestCyclone.name} is {minDistance} km from {userProfile.city}!
                </h3>
                <p className="text-xs text-rose-900/90 leading-relaxed max-w-2xl">
                  {nearestCyclone.intensity.categoryName} with sustained winds of{' '}
                  <strong>{nearestCyclone.intensity.windKmh} km/h</strong> moving {nearestCyclone.direction} at{' '}
                  <strong>{nearestCyclone.forwardSpeedKmh} km/h</strong>. Coastal communities are urged to prepare
                  immediate evacuation kits and follow local SDMA shelter instructions.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
              <button
                onClick={() => onOpenShare(nearestCyclone!, minDistance)}
                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Alert to Contacts</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 backdrop-blur-xl border border-emerald-400/40 text-emerald-950 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
              <div>
                <strong>No Immediate Direct Cyclone Impact at {userProfile.city}.</strong>
                <span className="text-slate-700 ml-1">
                  Nearest monitored cyclone is {nearestCyclone ? `${nearestCyclone.name} (${minDistance} km away)` : 'None in range'}.
                </span>
              </div>
            </div>
            {nearestCyclone && (
              <button
                onClick={() => onOpenShare(nearestCyclone!, minDistance)}
                className="text-[11px] font-bold text-[#0D4715] hover:underline flex items-center space-x-1"
              >
                <span>Share Nearest Storm Bulletin</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {/* Quick Coastal City Selector Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-600 text-[11px] font-medium">Test other coastal zones:</span>
          {POPULAR_COASTAL_LOCATIONS.map((loc) => (
            <button
              key={loc.city}
              onClick={() => onUpdateLocation(loc.city, loc.lat, loc.lon)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                userProfile.city === loc.city
                  ? 'bg-[#0D4715] text-[#EBE1D1] shadow-xs'
                  : 'bg-white/50 backdrop-blur-sm border border-white/60 text-slate-700 hover:bg-white/80'
              }`}
            >
              {loc.city.split(',')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 2. WORLD OCEAN MAP (Click sea for climate prediction & cyclone occurrence) */}
      <WorldSeaMap
        seas={seas}
        cyclones={cyclones}
        userProfile={userProfile}
        selectedSeaId={selectedSeaId}
        onSelectSea={(id) => setSelectedSeaId(id)}
        onOpenShare={(cyclone, dist) => onOpenShare(cyclone, dist)}
      />

      {/* 3. EMERGENCY CONTACTS & PREPAREDNESS PROTOCOL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Saved Contacts Card with Frosted Glass Transparency */}
        <div className="p-4 rounded-2xl bg-white/65 border border-white/80 shadow-[0_8px_24px_rgba(13,71,21,0.05),inset_0_1px_1.5px_rgba(255,255,255,0.9)] backdrop-blur-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-[#41644A]" />
              <h4 className="text-xs font-bold text-[#0D4715] uppercase tracking-wider">
                Emergency Alert Recipients
              </h4>
            </div>
            <button
              onClick={onOpenProfile}
              className="text-[11px] text-[#41644A] font-bold hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-2">
            {userProfile.emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-2.5 rounded-xl bg-white/50 backdrop-blur-md border border-white/70 text-xs flex items-center justify-between shadow-xs"
              >
                <div>
                  <div className="font-bold text-[#0D4715]">{contact.name}</div>
                  <div className="text-[10px] text-slate-600 font-mono">{contact.phone} • {contact.relation}</div>
                </div>
                <button
                  onClick={() => {
                    if (nearestCyclone) onOpenShare(nearestCyclone, minDistance);
                  }}
                  className="px-2 py-1 rounded-lg bg-white/80 hover:bg-[#41644A] hover:text-white border border-white/80 text-[10px] font-bold text-[#0D4715] transition-colors shadow-xs"
                >
                  Alert
                </button>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <a
              href="tel:112"
              className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>National Disaster Hotline: 112 / 1070</span>
            </a>
          </div>
        </div>

        {/* Coastal Evacuation & Safety Checklist with Frosted Glass Transparency */}
        <div className="p-4 rounded-2xl bg-white/65 border border-white/80 shadow-[0_8px_24px_rgba(13,71,21,0.05),inset_0_1px_1.5px_rgba(255,255,255,0.9)] backdrop-blur-2xl space-y-3 md:col-span-2">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-[#41644A]" />
            <h4 className="text-xs font-bold text-[#0D4715] uppercase tracking-wider">
              Coastal Citizen Survival & Evacuation Protocols
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/70 space-y-1 shadow-xs">
              <span className="font-bold text-[#0D4715] block">1. Emergency Go-Bag</span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Pack drinking water (3L/person), dry food rations, battery-operated transistor radio, waterproof document bag, prescription medications.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/70 space-y-1 shadow-xs">
              <span className="font-bold text-[#0D4715] block">2. Structural Safeguard</span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Board up glass windows, secure loose rooftop solar panels and tin sheets, turn off main electricity breaker and cooking gas valves.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/70 space-y-1 shadow-xs">
              <span className="font-bold text-[#0D4715] block">3. Evacuation Timing</span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Move to designated multi-purpose cyclone shelters (MPCS) at least 12 hours before landfall. Avoid seeking shelter under trees or electric poles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
