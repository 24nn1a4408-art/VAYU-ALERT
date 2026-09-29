import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CitizenDashboard } from './components/CitizenDashboard';
import { DisasterMgmtDashboard } from './components/DisasterMgmtDashboard';
import { ShareAlertModal } from './components/ShareAlertModal';
import { ClassificationModal } from './components/ClassificationModal';
import { UserProfileModal } from './components/UserProfileModal';
import { UserRole, UserProfile, CycloneData } from './types';
import { DEFAULT_USER_PROFILE, CYCLONES_DATABASE, WORLD_SEAS } from './data/vayuData';
import { Shield, Wind, Radio, AlertTriangle } from 'lucide-react';
import { AuthScreen } from './components/AuthScreen';
import { AuthUser, getSession, logout } from './auth/auth';
import { AlertHistory } from './components/AlertHistory';
import { EmergencyResponse } from './components/EmergencyResponse';
import { AuthorityCommandCenter } from './components/AuthorityCommandCenter';

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => getSession());
  const [activeRole, setActiveRole] = useState<UserRole>(() => getSession()?.role || 'citizen');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // User Profile state with localStorage persistence
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('vayu_alert_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user profile', e);
      }
    }
    return DEFAULT_USER_PROFILE;
  });

  // Keep the existing VAYU profile in sync with the authenticated account.
  useEffect(() => {
    if (!authUser) return;
    setUserProfile((current) => ({
      ...current,
      name: authUser.name,
      email: authUser.email,
    }));
  }, [authUser]);

  // Active cyclone database
  const [cyclones] = useState<CycloneData[]>(CYCLONES_DATABASE);
  const [seas] = useState(WORLD_SEAS);
  const [selectedCycloneId, setSelectedCycloneId] = useState<string>('cyclone-dana');

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isClassificationModalOpen, setIsClassificationModalOpen] = useState<boolean>(false);
  const [classificationInitialTab, setClassificationInitialTab] = useState<'intensity' | 'pressure'>('intensity');

  const [shareTargetCyclone, setShareTargetCyclone] = useState<CycloneData>(CYCLONES_DATABASE[0]);
  const [shareTargetDistance, setShareTargetDistance] = useState<number>(185);

  // Calculate user scroll position percentage
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = (scrollTop / docHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save profile changes to localStorage
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    try {
      localStorage.setItem('vayu_alert_user_profile', JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Could not save to localStorage', e);
    }
  };

  // Quick update of user location
  const handleUpdateLocation = (city: string, lat: number, lon: number) => {
    const updated = {
      ...userProfile,
      city,
      lat,
      lon,
    };
    handleSaveProfile(updated);
  };

  // Open share modal
  const handleOpenShare = (cyclone: CycloneData, distanceKm: number) => {
    setShareTargetCyclone(cyclone);
    setShareTargetDistance(distanceKm);
    setIsShareModalOpen(true);
  };

  // Open classification deep-dive modal
  const handleOpenClassification = (tab: 'intensity' | 'pressure') => {
    setClassificationInitialTab(tab);
    setIsClassificationModalOpen(true);
  };

  const activeCyclone = cyclones.find((c) => c.id === selectedCycloneId) || cyclones[0];

  if (!authUser) {
    return <AuthScreen onAuthenticated={(user) => { setAuthUser(user); setActiveRole(user.role); }} />;
  }

  const handleLogout = () => {
    logout();
    setAuthUser(null);
  };

  return (
    <div
      id="vayu-alert-app"
      className="min-h-screen bg-gradient-to-br from-[#EBE1D1] via-[#E4DCCF] to-[#DDD2BF] text-[#0D4715] flex flex-col font-sans selection:bg-[#41644A] selection:text-white relative"
    >
      {/* Global Subtle Horizontal Scroll Progress Bar */}
      <div
        id="global-scroll-progress-container"
        className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-white/30 backdrop-blur-md pointer-events-none"
      >
        <div
          id="global-scroll-progress-fill"
          className="h-full bg-gradient-to-r from-sky-400 via-[#41644A] to-[#0D4715] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(65,100,74,0.7)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Modern Glassmorphism Navigation Bar */}
      <Navbar
        activeRole={activeRole}
        setActiveRole={(role) => { if (role === 'disaster_mgmt' && authUser.role !== 'disaster_mgmt') return; setActiveRole(role); }}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        scrollProgress={scrollProgress}
        onLogout={handleLogout}
      />

      {/* Top Alert Ticker Banner with Frosted Glass Transparency */}
      <div className="relative z-20 bg-[#0D4715]/80 border-b border-white/20 text-[#EBE1D1] py-2 px-4 backdrop-blur-xl shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
              VAYU BULLETIN:
            </span>
            <span className="font-medium text-white/90">
              Cyclone DANA active in Bay of Bengal (157 km/h) • Typhoon YAGI in South China Sea • Cyclone TEJ in Arabian Sea
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span>
              Registered Location: <strong className="text-amber-300">{userProfile.city}</strong>
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <button
              onClick={() => handleOpenShare(cyclones[0], 185)}
              className="hidden sm:flex items-center space-x-1 text-amber-300 hover:text-white transition-colors"
            >
              <AlertTriangle className="h-3 w-3" />
              <span>Broadcast Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
        {/* Render Active Portal based on Selected Role */}
        {activeRole === 'citizen' ? (
          <>
            <CitizenDashboard
              userProfile={userProfile}
              cyclones={cyclones}
              seas={seas}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onOpenShare={handleOpenShare}
              onUpdateLocation={handleUpdateLocation}
            />
            <AlertHistory userProfile={userProfile} cyclones={cyclones} />
            <EmergencyResponse userProfile={userProfile} />
          </>
        ) : (
          <>
            <DisasterMgmtDashboard
              cyclones={cyclones}
              selectedCycloneId={selectedCycloneId}
              onSelectCyclone={setSelectedCycloneId}
              onOpenClassification={handleOpenClassification}
              onOpenShare={handleOpenShare}
            />
            <AuthorityCommandCenter cyclone={activeCyclone} />
          </>
        )}
      </main>

      {/* Modals */}
      <ShareAlertModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        cyclone={shareTargetCyclone}
        userProfile={userProfile}
        distanceKm={shareTargetDistance}
      />

      <ClassificationModal
        isOpen={isClassificationModalOpen}
        onClose={() => setIsClassificationModalOpen(false)}
        cyclone={activeCyclone}
        initialTab={classificationInitialTab}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onSave={handleSaveProfile}
      />

      {/* Footer with Frosted Glass Transparency */}
      <footer className="relative z-10 bg-[#0D4715]/80 border-t border-white/20 text-[#EBE1D1] py-8 px-4 backdrop-blur-xl mt-12 shadow-[0_-8px_32px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-[#41644A] flex items-center justify-center text-amber-300">
              <Wind className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide">VAYU ALERT</div>
              <p className="text-[11px] text-[#EBE1D1]/75">
                Intelligent Cyclone Early Warning, Ocean Climate Surveillance & Disaster Management System
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-300 text-[11px]">
            <span>National Emergency: <strong>112</strong></span>
            <span>State Emergency Operation Centre (SEOC): <strong>1070</strong></span>
            <span>Meteorological Data Source: <strong>IMD / JTWC / WMO RSMC</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
