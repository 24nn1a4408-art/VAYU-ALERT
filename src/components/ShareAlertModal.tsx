import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare, PhoneCall, AlertTriangle, Send } from 'lucide-react';
import { CycloneData, UserProfile } from '../types';

interface ShareAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  cyclone: CycloneData;
  userProfile: UserProfile;
  distanceKm?: number;
}

export const ShareAlertModal: React.FC<ShareAlertModalProps> = ({
  isOpen,
  onClose,
  cyclone,
  userProfile,
  distanceKm,
}) => {
  const [copied, setCopied] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  if (!isOpen) return null;

  const distanceText = distanceKm !== undefined ? `Distance to ${userProfile.city}: ${distanceKm} km.` : '';
  const alertText = `🚨 VAYU ALERT - CYCLONE WARNING 🚨
Storm: ${cyclone.name} (${cyclone.intensity.categoryName})
Basin: ${cyclone.basinName}
Alert Level: ${cyclone.alertLevel.toUpperCase()} ALERT
Speed & Movement: ${cyclone.direction} at ${cyclone.forwardSpeedKmh} km/h
Max Sustained Wind: ${cyclone.intensity.windKmh} km/h (${cyclone.intensity.windKt} kt)
Central Pressure: ${cyclone.pressure.centralPressureHpa} hPa (Drop: -${cyclone.pressure.pressureDropHpa} hPa)
${distanceText}
Landfall Warning: ${cyclone.location.nearestLandmark}

Immediate Action: Stay indoors, prepare emergency battery kit, follow NDRF/SDMA instructions.
Emergency Helpline: 112 / 1070 (Toll-Free).`;

  const handleCopy = () => {
    navigator.clipboard.writeText(alertText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(alertText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white/75 border border-white/80 shadow-[0_25px_60px_rgba(13,71,21,0.18),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-3xl">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0D4715]/95 text-[#EBE1D1] flex items-center justify-between border-b border-white/20 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <Share2 className="h-5 w-5 text-amber-300" />
            <h3 className="text-base font-bold tracking-wide">Share VAYU Cyclone Alert</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#EBE1D1] hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Threat summary badge */}
          <div className={`p-3.5 rounded-xl border backdrop-blur-md flex items-start space-x-3 shadow-xs ${
            cyclone.alertLevel === 'red'
              ? 'bg-rose-500/15 border-rose-300 text-rose-950'
              : 'bg-amber-500/15 border-amber-300 text-amber-950'
          }`}>
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="text-xs">
              <strong className="block text-sm font-bold">
                {cyclone.name} — {cyclone.intensity.categoryCode} ({cyclone.alertLevel.toUpperCase()} ALERT)
              </strong>
              <span>
                Forward speed: {cyclone.forwardSpeedKmh} km/h • Wind: {cyclone.intensity.windKmh} km/h • Pressure: {cyclone.pressure.centralPressureHpa} hPa
              </span>
            </div>
          </div>

          {/* Formatted Alert Preview */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D4715] flex items-center justify-between">
              <span>Alert Advisory Message (Ready to Dispatch)</span>
              <span className="text-[11px] text-[#41644A] font-normal">Standard Citizen Warning Protocol</span>
            </label>
            <textarea
              readOnly
              value={alertText}
              rows={8}
              className="w-full p-3 font-mono text-xs rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 text-slate-800 focus:outline-none resize-none leading-relaxed shadow-inner"
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-white/80 bg-white/70 hover:bg-white text-[#0D4715] text-xs font-semibold shadow-xs transition-all backdrop-blur-sm"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-[#41644A]" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Alert Text'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Share to WhatsApp</span>
            </button>
          </div>

          {/* Emergency Contacts Direct Dispatch */}
          <div className="pt-2 border-t border-white/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#0D4715]">
                Saved Emergency Contacts ({userProfile.emergencyContacts.length})
              </span>
              <span className="text-[10px] font-mono text-[#41644A]">Direct SMS Gateway Simulation</span>
            </div>

            <div className="space-y-2">
              {userProfile.emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 text-xs text-slate-800 shadow-xs"
                >
                  <div>
                    <div className="font-semibold text-[#0D4715]">{contact.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {contact.phone} • {contact.relation}
                    </div>
                  </div>
                  <a
                    href={`sms:${contact.phone}?body=${encodeURIComponent(alertText)}`}
                    className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-[#0D4715] hover:text-white text-[#0D4715] font-semibold text-[11px] border border-white/80 transition-colors flex items-center space-x-1 shadow-xs"
                  >
                    <span>Send SMS</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Broadcast Button */}
            <button
              onClick={handleBroadcast}
              disabled={broadcastSent}
              className={`w-full mt-3 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                broadcastSent
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#0D4715] hover:bg-[#41644A] text-[#EBE1D1]'
              }`}
            >
              {broadcastSent ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Alert Successfully Dispatched to {userProfile.emergencyContacts.length} Contacts!</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Instant Broadcast to All {userProfile.emergencyContacts.length} Emergency Contacts</span>
                </>
              )}
            </button>
          </div>

          {/* National Help Line Footnote */}
          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-300/60 backdrop-blur-sm text-[11px] text-rose-950 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2">
              <PhoneCall className="h-4 w-4 text-rose-700" />
              <span>National Disaster Emergency Response: <strong>112</strong> / State SEOC: <strong>1070</strong></span>
            </div>
            <a
              href="tel:112"
              className="px-2.5 py-1 rounded bg-rose-700 text-white font-bold text-[10px] hover:bg-rose-800 transition-colors shadow-xs"
            >
              Call 112
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
