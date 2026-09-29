import React from 'react';
import { Wind, ShieldAlert, User, PhoneCall, ArrowUp, Compass, LogOut } from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface NavbarProps {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  scrollProgress?: number;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  setActiveRole,
  userProfile,
  onOpenProfile,
  scrollProgress = 0,
  onLogout,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 glass-nav transition-all shadow-[0_6px_24px_rgba(13,71,21,0.06)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo: VAYU ALERT */}
          <button
            id="brand-logo-btn"
            onClick={scrollToTop}
            className="flex items-center space-x-3 text-left group focus:outline-none"
            aria-label="Scroll to top of page"
          >
            <div className="h-10 w-10 rounded-xl bg-[#0D4715] border border-[#41644A]/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-all shadow-md">
              <Wind className="h-5 w-5 animate-spin-slow text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-[#0D4715] tracking-tight group-hover:text-[#41644A] transition-colors">
                  VAYU ALERT
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono font-bold animate-pulse">
                  LIVE SURVEILLANCE
                </span>
              </div>
              <p className="text-[11px] text-[#41644A] font-semibold">
                Multimodal Cyclone Early Warning & Ocean Surveillance System
              </p>
            </div>
          </button>

          {/* User Profile & Emergency Helpline Quick Controls */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* National Helpline Chip */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs text-rose-900 shadow-xs">
              <PhoneCall className="h-3.5 w-3.5 text-rose-600" />
              <span className="font-bold text-[11px]">Helpline: 112 / 1070</span>
            </div>

            {/* User Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EBE1D1]/90 hover:bg-[#EBE1D1] border border-[#41644A]/30 text-xs text-[#0D4715] font-semibold transition-all shadow-xs"
              title="Click to edit profile and emergency contacts"
            >
              <div className="h-5 w-5 rounded-full bg-[#41644A] text-white flex items-center justify-center text-[10px] font-bold">
                {userProfile.name.charAt(0)}
              </div>
              <span className="text-[11px] max-w-[120px] truncate">{userProfile.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#0D4715] border border-[#41644A]/20">
                {userProfile.city.split(',')[0]}
              </span>
            </button>

            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              title="Scroll to top"
              className="p-1.5 rounded-lg bg-[#EBE1D1]/80 hover:bg-[#EBE1D1] border border-white/90 text-[#0D4715] hover:text-[#41644A] transition-all shadow-xs"
            >
              <ArrowUp className="h-4 w-4" />
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Logout"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Profile & Logout Controls */}
          <div className="sm:hidden flex items-center gap-2 ml-3">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#EBE1D1]/90 border border-[#41644A]/30 text-[11px] text-[#0D4715] font-semibold"
              title="Profile"
            >
              <div className="h-5 w-5 rounded-full bg-[#41644A] text-white flex items-center justify-center text-[10px] font-bold">
                {userProfile.name.charAt(0)}
              </div>
              <span className="max-w-[70px] truncate">{userProfile.name}</span>
            </button>
            <button
              onClick={onLogout}
              title="Logout"
              aria-label="Logout"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 2 USERS ROLE SWITCHER NAVIGATION */}
        <div className="flex items-center justify-between py-2 border-t border-[#41644A]/15 overflow-x-auto">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:inline">
              Select User Portal:
            </span>

            {/* USER 1 TAB */}
            <button
              id="role-tab-citizen"
              onClick={() => setActiveRole('citizen')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeRole === 'citizen'
                  ? 'bg-[#0D4715] text-[#EBE1D1] shadow-md ring-1 ring-[#0D4715]'
                  : 'bg-white/80 text-[#0D4715] hover:bg-[#EBE1D1] border border-[#41644A]/25'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>User 1: Citizen Alert & World Sea Map</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-900 font-mono font-bold">
                Public
              </span>
            </button>

            {/* USER 2 TAB */}
            <button
              id="role-tab-disaster"
              onClick={() => setActiveRole('disaster_mgmt')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeRole === 'disaster_mgmt'
                  ? 'bg-[#0D4715] text-[#EBE1D1] shadow-md ring-1 ring-[#0D4715]'
                  : 'bg-white/80 text-[#0D4715] hover:bg-[#EBE1D1] border border-[#41644A]/25'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>User 2: Disaster Management Authority Ops</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono font-bold">
                Command
              </span>
            </button>
          </div>

          {/* Current Active Mode indicator */}
          <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-[#0D4715]">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>
              Mode:{' '}
              <strong>
                {activeRole === 'citizen' ? 'Citizen Marine Advisory' : 'NDRF Tactical Zonation & Telemetry'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Horizontal Scroll Progress Bar */}
      <div className="w-full h-[2.5px] bg-[#EBE1D1]/60 overflow-hidden">
        <div
          id="navbar-scroll-progress-fill"
          className="h-full bg-gradient-to-r from-sky-400 via-[#41644A] to-[#0D4715] transition-all duration-150 ease-out shadow-[0_0_8px_rgba(65,100,74,0.6)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
};
