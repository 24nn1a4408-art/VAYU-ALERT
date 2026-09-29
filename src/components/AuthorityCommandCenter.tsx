import React, { useState } from 'react';
import { Activity, Users, Radio, Siren, CheckCircle2, Truck, Hospital, Home, Megaphone, ClipboardCheck } from 'lucide-react';
import { CycloneData } from '../types';

interface Props { cyclone: CycloneData; }

export const AuthorityCommandCenter: React.FC<Props> = ({ cyclone }) => {
  const [tasks, setTasks] = useState({ shelter: false, medical: false, teams: false, transport: false, broadcast: false });
  const completed = Object.values(tasks).filter(Boolean).length;
  const toggle = (k: keyof typeof tasks) => setTasks(v => ({...v, [k]: !v[k]}));

  const cards = [
    ['Active Cyclone', cyclone.name, Activity, 'text-rose-700'],
    ['Population at Risk', cyclone.affectedAreas.highAlertRed.populationAtRisk || 'Assessing', Users, 'text-amber-700'],
    ['Alert Status', cyclone.alertLevel.toUpperCase(), Radio, 'text-[#0D4715]'],
    ['Response Readiness', `${Math.round((completed / 5) * 100)}%`, ClipboardCheck, 'text-sky-700'],
  ];
  const tasksList = [
    ['shelter','Confirm shelters','Open and verify designated shelters',Home],
    ['medical','Coordinate medical teams','Confirm ambulance and hospital readiness',Hospital],
    ['teams','Deploy field teams','Position response teams in high-risk zones',Truck],
    ['transport','Prepare evacuation transport','Confirm buses/boats and routes',Truck],
    ['broadcast','Broadcast public warning','Send verified warning to affected areas',Megaphone],
  ] as const;

  return <section className="p-5 rounded-2xl bg-white/65 border border-white/80 shadow-sm backdrop-blur-2xl space-y-4">
    <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-[#0D4715] text-amber-300 flex items-center justify-center"><Siren className="h-5 w-5" /></div><div><h3 className="text-lg font-extrabold text-[#0D4715]">Operational Command Center</h3><p className="text-xs text-slate-500">Track response readiness and operational actions for {cyclone.name}</p></div></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{cards.map(([label,value,Icon,tone]) => <div key={String(label)} className="p-4 rounded-xl bg-white/75 border border-white"><Icon className={`h-5 w-5 ${tone} mb-2`} /><div className="text-[10px] uppercase font-bold text-slate-500">{label}</div><div className="text-lg font-black text-[#0D4715] mt-1">{String(value)}</div></div>)}</div>
    <div className="p-4 rounded-xl bg-[#EBE1D1]/60 border border-[#41644A]/20">
      <div className="flex items-center justify-between mb-3"><div><div className="font-extrabold text-[#0D4715]">Response checklist</div><div className="text-[11px] text-slate-500">{completed}/5 operational tasks completed</div></div><div className="text-sm font-black text-[#0D4715]">{completed * 20}%</div></div>
      <div className="h-2 rounded-full bg-white overflow-hidden"><div className="h-full bg-[#41644A] transition-all" style={{width:`${completed*20}%`}} /></div>
      <div className="grid md:grid-cols-2 gap-2 mt-4">{tasksList.map(([key,title,desc,Icon]) => <button key={key} onClick={() => toggle(key)} className={`text-left p-3 rounded-xl border transition ${tasks[key] ? 'bg-emerald-50 border-emerald-200' : 'bg-white/70 border-white hover:border-[#41644A]/30'}`}><div className="flex items-start gap-3"><Icon className={`h-4 w-4 mt-0.5 ${tasks[key] ? 'text-emerald-700' : 'text-[#41644A]'}`} /><div className="flex-1"><div className="text-xs font-bold text-[#0D4715]">{title}</div><div className="text-[10px] text-slate-500">{desc}</div></div>{tasks[key] && <CheckCircle2 className="h-4 w-4 text-emerald-700" />}</div></button>)}</div>
    </div>
  </section>;
};
