import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Plus, Trash2, Check, Shield } from 'lucide-react';
import { UserProfile, EmergencyContact } from '../types';
import { POPULAR_COASTAL_LOCATIONS } from '../data/vayuData';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Family');
  const [savedFeedback, setSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const handleCitySelect = (cityObj: typeof POPULAR_COASTAL_LOCATIONS[0]) => {
    setFormData({
      ...formData,
      city: cityObj.city,
      lat: cityObj.lat,
      lon: cityObj.lon,
    });
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    const newContact: EmergencyContact = {
      id: `contact-${Date.now()}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      email: '',
      relation: newContactRelation,
    };
    setFormData({
      ...formData,
      emergencyContacts: [...formData.emergencyContacts, newContact],
    });
    setNewContactName('');
    setNewContactPhone('');
  };

  const handleRemoveContact = (id: string) => {
    setFormData({
      ...formData,
      emergencyContacts: formData.emergencyContacts.filter((c) => c.id !== id),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white/75 border border-white/80 shadow-[0_25px_60px_rgba(13,71,21,0.18),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-3xl">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0D4715]/95 text-[#EBE1D1] flex items-center justify-between border-b border-white/20 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-amber-300" />
            <h3 className="text-base font-bold tracking-wide">Citizen Profile & Emergency Contacts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#EBE1D1] hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Basic User Details */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D4715] flex items-center space-x-1.5">
              <Shield className="h-4 w-4 text-[#41644A]" />
              <span>User Basic Credentials</span>
            </span>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 focus:outline-none focus:ring-1 focus:ring-[#41644A] shadow-xs"
                placeholder="e.g. Aarav Sharma"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center space-x-1">
                  <Phone className="h-3 w-3 text-[#41644A]" />
                  <span>Mobile Phone (for SMS Alerts)</span>
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 focus:outline-none focus:ring-1 focus:ring-[#41644A] shadow-xs"
                  placeholder="+91 98450 12345"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center space-x-1">
                  <Mail className="h-3 w-3 text-[#41644A]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 focus:outline-none focus:ring-1 focus:ring-[#41644A] shadow-xs"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center space-x-1">
                <MapPin className="h-3 w-3 text-rose-600" />
                <span>Primary Coastal Location (Monitored for Cyclone Warning)</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 focus:outline-none focus:ring-1 focus:ring-[#41644A] shadow-xs"
                placeholder="e.g. Puri, Odisha"
                required
              />

              {/* Quick Popular Coastal Towns */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] text-slate-500 py-0.5">Quick Select:</span>
                {POPULAR_COASTAL_LOCATIONS.slice(0, 6).map((item) => (
                  <button
                    type="button"
                    key={item.city}
                    onClick={() => handleCitySelect(item)}
                    className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                      formData.city === item.city
                        ? 'bg-[#41644A] text-white border-[#41644A] shadow-xs'
                        : 'bg-white/70 text-slate-700 border-white/80 hover:bg-white/95'
                    }`}
                  >
                    {item.city.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Contacts Section */}
          <div className="pt-3 border-t border-white/60 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D4715] block">
              Emergency Contact List (Auto-Notified during Cyclone High Alert)
            </span>

            <div className="space-y-2">
              {formData.emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/65 backdrop-blur-md border border-white/80 text-xs shadow-xs"
                >
                  <div>
                    <span className="font-bold text-[#0D4715]">{contact.name}</span>
                    <span className="text-[11px] text-slate-500 ml-2">({contact.relation})</span>
                    <div className="text-[11px] font-mono text-[#41644A]">{contact.phone}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveContact(contact.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Contact Form */}
            <div className="p-3 rounded-xl bg-white/45 backdrop-blur-md border border-white/70 space-y-2 shadow-xs">
              <span className="text-[11px] font-bold text-[#0D4715] block">Add New Emergency Contact</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-white/70 backdrop-blur-sm border border-white/80 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Mobile"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-white/70 backdrop-blur-sm border border-white/80 focus:outline-none"
                />
                <select
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className="px-2 py-1.5 text-xs rounded-lg bg-white/70 backdrop-blur-sm border border-white/80 focus:outline-none text-slate-700"
                >
                  <option value="Immediate Family">Immediate Family</option>
                  <option value="Parent / Sibling">Parent / Sibling</option>
                  <option value="Local Authority">Local Authority</option>
                  <option value="Neighbor / Friend">Neighbor / Friend</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddContact}
                disabled={!newContactName.trim() || !newContactPhone.trim()}
                className="w-full py-1.5 rounded-lg bg-white/80 hover:bg-[#41644A] hover:text-white border border-white/80 text-xs font-semibold text-[#0D4715] flex items-center justify-center space-x-1 transition-colors disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add to Emergency Broadcast</span>
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#0D4715] hover:bg-[#41644A] text-[#EBE1D1] text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2"
            >
              {savedFeedback ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300" />
                  <span>Profile Saved Successfully!</span>
                </>
              ) : (
                <span>Save Profile & Emergency Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
