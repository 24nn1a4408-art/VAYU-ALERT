import React, { useEffect, useState } from 'react';
import { BellRing, CheckCircle2, Trash2, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { AlertHistoryItem, AlertSeverity, CycloneData, UserProfile } from '../types';

interface Props {
  userProfile: UserProfile;
  cyclones: CycloneData[];
}

const keyFor = (email: string) => `vayu_alert_history_${email.toLowerCase()}`;

export const AlertHistory: React.FC<Props> = ({ userProfile, cyclones }) => {
  const [history, setHistory] = useState<AlertHistoryItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyFor(userProfile.email));
      setHistory(raw ? JSON.parse(raw) : []);
    } catch { setHistory([]); }
  }, [userProfile.email]);

  const persist = (items: AlertHistoryItem[]) => {
    setHistory(items);
    localStorage.setItem(keyFor(userProfile.email), JSON.stringify(items));
  };

  const recordCurrentAlerts = () => {
    const now = new Date().toISOString();
    const newItems: AlertHistoryItem[] = cyclones.slice(0, 3).map((c) => ({
      id: `${c.id}-${Date.now()}`,
      cycloneName: c.name,
      severity: c.alertLevel as AlertSeverity,
      location: userProfile.city,
      message: `${c.status} cyclone advisory. Current wind ${c.intensity.windKmh} km/h.`,
      timestamp: now,
    }));
    persist([...newItems, ...history].slice(0, 30));
  };

  const clearHistory = () => persist([]);

  const severity = (s: AlertSeverity) => s === 'red' ? 'HIGH' : s === 'yellow' ? 'MODERATE' : s === 'green' ? 'LOW' : 'INFO';
  const badge = (s: AlertSeverity) => s === 'red' ? 'bg-rose-100 text-rose-700 border-rose-200' : s === 'yellow' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200';

  return (
    <section className="p-5 rounded-2xl bg-white/65 border border-white/80 shadow-sm backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#0D4715] text-amber-300 flex items-center justify-center"><BellRing className="h-5 w-5" /></div>
          <div><h3 className="text-lg font-extrabold text-[#0D4715]">Alert History</h3><p className="text-xs text-slate-500">Your recent cyclone warnings and advisories</p></div>
        </div>
        <div className="flex gap-2">
          <button onClick={recordCurrentAlerts} className="px-3 py-2 rounded-lg bg-[#0D4715] text-white text-xs font-bold">Record Current Alerts</button>
          {history.length > 0 && <button onClick={clearHistory} className="px-3 py-2 rounded-lg bg-white border border-rose-200 text-rose-700 text-xs font-bold"><Trash2 className="inline h-3.5 w-3.5 mr-1" />Clear</button>}
        </div>
      </div>
      {history.length === 0 ? (
        <div className="p-5 rounded-xl bg-white/60 border border-white text-center text-sm text-slate-500"><CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-emerald-600" />No alerts recorded for this account yet.</div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {history.map((item) => (
            <div key={item.id} className="p-3 rounded-xl bg-white/70 border border-white flex gap-3">
              <div className={`px-2 py-1 rounded-lg border text-[10px] font-black h-fit ${badge(item.severity)}`}><AlertTriangle className="inline h-3 w-3 mr-1" />{severity(item.severity)}</div>
              <div className="flex-1 min-w-0"><div className="font-bold text-sm text-[#0D4715]">{item.cycloneName}</div><p className="text-xs text-slate-600">{item.message}</p><div className="flex flex-wrap gap-3 mt-1 text-[10px] text-slate-500"><span><MapPin className="inline h-3 w-3 mr-1" />{item.location}</span><span><Clock className="inline h-3 w-3 mr-1" />{new Date(item.timestamp).toLocaleString()}</span></div></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
