import React from 'react';
import { Ambulance, PhoneCall, ShieldAlert, Building2, Flame, MapPinned, LifeBuoy, Navigation } from 'lucide-react';
import { UserProfile } from '../types';

interface Props { userProfile: UserProfile; }

const actions = [
  { label: 'National Emergency', number: '112', icon: PhoneCall, tone: 'rose' },
  { label: 'Ambulance', number: '108', icon: Ambulance, tone: 'emerald' },
  { label: 'Fire & Rescue', number: '101', icon: Flame, tone: 'amber' },
  { label: 'Disaster Management', number: '1070', icon: ShieldAlert, tone: 'sky' },
];

export const EmergencyResponse: React.FC<Props> = ({ userProfile }) => (
  <section className="p-5 rounded-2xl bg-white/65 border border-white/80 shadow-sm backdrop-blur-2xl">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-10 w-10 rounded-xl bg-rose-700 text-white flex items-center justify-center"><LifeBuoy className="h-5 w-5" /></div>
      <div><h3 className="text-lg font-extrabold text-[#0D4715]">Emergency Response Center</h3><p className="text-xs text-slate-500">Fast access to emergency support during a cyclone</p></div>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map(({label, number, icon: Icon}) => (
        <a key={number} href={`tel:${number}`} className="p-4 rounded-xl bg-white/75 border border-white hover:shadow-md transition">
          <Icon className="h-5 w-5 text-rose-700 mb-2" />
          <div className="text-xs font-bold text-slate-600">{label}</div>
          <div className="text-xl font-black text-[#0D4715]">{number}</div>
          <div className="text-[10px] text-rose-700 font-bold mt-1">Tap to call</div>
        </a>
      ))}
    </div>
    <div className="grid md:grid-cols-2 gap-3 mt-4">
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
        <div className="font-extrabold text-amber-900 flex items-center gap-2"><Building2 className="h-4 w-4" />Nearest support</div>
        <p className="text-xs text-amber-800 mt-1">Use your monitored location <strong>{userProfile.city}</strong> when contacting emergency services. Local shelter and hospital details can be connected to the live map during deployment.</p>
        <button onClick={() => window.open(`https://www.google.com/maps/search/emergency+shelter+near+${encodeURIComponent(userProfile.city)}`, '_blank')} className="mt-3 px-3 py-2 rounded-lg bg-amber-900 text-white text-xs font-bold"><MapPinned className="inline h-3.5 w-3.5 mr-1" />Find nearby shelters</button>
      </div>
      <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
        <div className="font-extrabold text-sky-900 flex items-center gap-2"><Navigation className="h-4 w-4" />During a cyclone</div>
        <ul className="text-xs text-sky-800 mt-2 space-y-1"><li>• Follow official evacuation instructions.</li><li>• Move to a designated safe shelter when advised.</li><li>• Keep phone, water, medicines and essential documents ready.</li><li>• Avoid flooded roads and exposed coastal areas.</li></ul>
      </div>
    </div>
    {userProfile.emergencyContacts.length > 0 && <div className="mt-3 p-3 rounded-xl bg-white/70 border border-white"><div className="text-xs font-bold text-[#0D4715]">Your emergency contacts</div><div className="flex flex-wrap gap-2 mt-2">{userProfile.emergencyContacts.map(c => <a key={c.id} href={`tel:${c.phone}`} className="px-3 py-1.5 rounded-lg bg-[#EBE1D1] text-xs font-bold text-[#0D4715]">{c.name} · {c.phone}</a>)}</div></div>}
  </section>
);
