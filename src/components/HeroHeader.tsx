import React from 'react';
import { Compass, ShieldCheck, ChevronDown, ArrowRight, BarChart3, Database, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { DataQualityReport } from '../types';

interface HeroHeaderProps {
  report: DataQualityReport;
  onNavigateTab: (tabId: string) => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ report, onNavigateTab }) => {
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaClick = (tabId: string) => {
    onNavigateTab(tabId);
    setTimeout(() => {
      scrollToSection('dashboard-section');
    }, 50);
  };

  return (
    <section
      id="top-hero"
      className="relative min-h-[82vh] sm:min-h-[88vh] flex flex-col justify-between overflow-hidden border-b border-[#41644A]/20 bg-gradient-to-b from-[#0D4715]/95 via-[#184022]/90 to-[#0A2614]/95"
    >
      {/* Static Atmospheric Ambient Backdrop (No moving animations or vector paths) */}
      <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-emerald-400/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[260px] bg-teal-400/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35 pointer-events-none" />
      </div>

      {/* Main Glassmorphism Hero Container */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full">
          {/* Glassmorphism Presentation Panel with Crystalline Frosted Transparency */}
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-white/90 via-sky-100/60 to-white/70 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
          >
            <div
              id="hero-glass-card"
              className="rounded-[23px] backdrop-blur-[36px] bg-white/60 p-6 sm:p-10 relative overflow-hidden border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.95)]"
            >
              {/* Subtle specular light refractions inside the glass */}
              <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-sky-200/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-200/15 blur-3xl pointer-events-none" />

              {/* Top Specular Edge Highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

              <div className="relative z-10 space-y-6">
                {/* Header Badges with Frosted Glass Transparency */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/65 backdrop-blur-md border border-white/75 text-[#0D4715] text-xs font-mono font-medium shadow-xs">
                    <Compass className="h-3.5 w-3.5 text-[#41644A]" />
                    <span>North Indian Ocean Basin • BOB & Arabian Sea</span>
                  </div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#41644A]/20 backdrop-blur-md border border-white/60 text-[#0D4715] text-xs font-mono font-semibold shadow-xs">
                    <CheckCircle2 className="h-3 w-3 text-[#0D4715]" />
                    <span>10 / 10 Gates Certified</span>
                  </div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/65 backdrop-blur-md border border-white/75 text-[#0D4715] text-xs font-mono font-medium shadow-xs">
                    <ShieldCheck className="h-3 w-3 text-[#41644A]" />
                    <span>Rule 1: Pre-Training Phase</span>
                  </div>
                </div>

                {/* Title & Core Subtitle */}
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0D4715]">
                    CycloneFusion-AI
                  </h1>
                  <p className="text-sm sm:text-base text-[#183921] leading-relaxed font-normal max-w-3xl">
                    A multimodal spatiotemporal AI platform for tropical cyclone identification,
                    intensity forecasting, and short-term track prediction. Powered by satellite imagery,
                    synoptic reanalysis, and physics-constrained multi-task architectures.
                  </p>
                </div>

                {/* Glass Metric Grid with True Frosted Glass Transparency */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="p-3.5 rounded-2xl bg-white/55 hover:bg-white/75 backdrop-blur-xl border border-white/80 hover:border-white transition-all shadow-[0_4px_16px_rgba(13,71,21,0.04),inset_0_1px_1.5px_rgba(255,255,255,0.9)]"
                  >
                    <div className="text-[11px] text-[#41644A] font-semibold">Validation Gates</div>
                    <div className="text-xl font-bold font-mono text-[#0D4715] mt-1">10 / 10 PASS</div>
                    <div className="text-[10px] text-[#41644A]/80 mt-0.5">Automated Checks</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.17, ease: [0.22, 1, 0.36, 1] }}
                    className="p-3.5 rounded-2xl bg-white/55 hover:bg-white/75 backdrop-blur-xl border border-white/80 hover:border-white transition-all shadow-[0_4px_16px_rgba(13,71,21,0.04),inset_0_1px_1.5px_rgba(255,255,255,0.9)]"
                  >
                    <div className="text-[11px] text-[#41644A] font-semibold">Synoptic Catalog</div>
                    <div className="text-xl font-bold font-mono text-[#0D4715] mt-1">204 Fixes</div>
                    <div className="text-[10px] text-[#41644A]/80 mt-0.5">6-Hour Intervals</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="p-3.5 rounded-2xl bg-white/55 hover:bg-white/75 backdrop-blur-xl border border-white/80 hover:border-white transition-all shadow-[0_4px_16px_rgba(13,71,21,0.04),inset_0_1px_1.5px_rgba(255,255,255,0.9)]"
                  >
                    <div className="text-[11px] text-[#41644A] font-semibold">Cyclone Events</div>
                    <div className="text-xl font-bold font-mono text-[#0D4715] mt-1">10 Storms</div>
                    <div className="text-[10px] text-[#41644A]/80 mt-0.5">Leakage-Safe Partition</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.31, ease: [0.22, 1, 0.36, 1] }}
                    className="p-3.5 rounded-2xl bg-white/55 hover:bg-white/75 backdrop-blur-xl border border-white/80 hover:border-white transition-all shadow-[0_4px_16px_rgba(13,71,21,0.04),inset_0_1px_1.5px_rgba(255,255,255,0.9)]"
                  >
                    <div className="text-[11px] text-[#41644A] font-semibold">Peak Intensity</div>
                    <div className="text-xl font-bold font-mono text-[#0D4715] mt-1">140 kt</div>
                    <div className="text-[10px] text-[#41644A]/80 mt-0.5">Amphan (SuCS)</div>
                  </motion.div>
                </div>

                {/* Action Buttons with Glass Highlights */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    id="hero-cta-gates-btn"
                    onClick={() => handleCtaClick('gates')}
                    className="px-4 py-2.5 rounded-xl bg-[#41644A]/90 hover:bg-[#0D4715] text-[#EBE1D1] font-semibold text-xs backdrop-blur-md border border-white/25 transition-all shadow-md shadow-[#0D4715]/20 flex items-center space-x-2"
                  >
                    <span>Inspect 10 Validation Gates</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    id="hero-cta-eda-btn"
                    onClick={() => handleCtaClick('eda')}
                    className="px-4 py-2.5 rounded-xl bg-white/60 hover:bg-white/80 text-[#0D4715] font-semibold text-xs backdrop-blur-md border border-white/70 transition-all flex items-center space-x-2 shadow-xs"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-[#41644A]" />
                    <span>Exploratory Climatology (EDA)</span>
                  </button>

                  <button
                    id="hero-cta-specs-btn"
                    onClick={() => handleCtaClick('architecture')}
                    className="px-4 py-2.5 rounded-xl bg-white/60 hover:bg-white/80 text-[#0D4715] font-semibold text-xs backdrop-blur-md border border-white/70 transition-all flex items-center space-x-2 shadow-xs"
                  >
                    <Database className="h-3.5 w-3.5 text-[#41644A]" />
                    <span>Repository Specs & CI</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Smooth Scroll Down Indicator */}
      <div className="relative z-20 pb-5 pt-2 flex flex-col items-center justify-center">
        <button
          id="scroll-to-dashboard-btn"
          onClick={() => scrollToSection('dashboard-section')}
          className="group flex flex-col items-center space-y-1.5 text-white/90 hover:text-white transition-colors"
          aria-label="Scroll down to dashboard"
        >
          <span className="text-[11px] font-mono tracking-wider uppercase text-white/80 font-semibold drop-shadow-xs">
            Scroll to Explore
          </span>
          <div className="h-8 w-8 rounded-full bg-white/20 group-hover:bg-white/35 backdrop-blur-md border border-white/40 flex items-center justify-center transition-all animate-bounce shadow-xs">
            <ChevronDown className="h-4 w-4 text-white" />
          </div>
        </button>
      </div>
    </section>
  );
};
