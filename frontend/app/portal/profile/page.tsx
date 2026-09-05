'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  ShieldCheck,
  Smartphone,
  Mail,
  MapPin,
  Globe,
  Save,
  CheckCircle2,
  Clock,
  KeyRound,
  Building2,
} from 'lucide-react';
import { PortalLayout } from '../../../components/portal/PortalLayout';
import { Button } from '../../../components/ui/Button';
import { citizenService } from '../../../services/citizen.service';
import { CitizenProfile } from '../../../types/citizen';

export default function CitizenProfilePage() {
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [taluka, setTaluka] = useState('');
  const [village, setVillage] = useState('');
  const [language, setLanguage] = useState<'English' | 'मराठी' | 'हिन्दी'>('English');

  useEffect(() => {
    const prof = citizenService.getProfile();
    setProfile(prof);
    setName(prof.name);
    setEmail(prof.email);
    setDistrict(prof.district);
    setTaluka(prof.taluka);
    setVillage(prof.village);
    setLanguage((prof.preferredLanguage as 'English' | 'मराठी' | 'हिन्दी') || 'English');
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = citizenService.updateProfile({
      name,
      email,
      district,
      taluka,
      village,
      preferredLanguage: language,
    });
    setProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PortalLayout>
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
          <UserCheck className="w-4 h-4" />
          <span>Citizen Profile</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          Profile &amp; Communication Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your verified citizen credentials, regional jurisdiction, and multilingual portal options.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Profile preferences successfully saved and updated in local registry.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Edit Profile Form */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <form onSubmit={handleSave} className="space-y-5">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name (as per Aadhaar)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Aadhaar-Linked Mobile
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={profile?.mobile || '+91 98220 12345'}
                    className="w-full text-xs font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-lg p-2.5 cursor-not-allowed"
                  />
                  <ShieldCheck className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Verified via OTP &bull; Linked with revenue authentication
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                >
                  <option value="English">English</option>
                  <option value="मराठी">मराठी (Marathi)</option>
                  <option value="हिन्दी">हिन्दी (Hindi)</option>
                </select>
              </div>
            </div>

            <h2 className="text-sm font-bold text-slate-900 pt-4 pb-2 border-b border-slate-100">
              Primary Land Jurisdiction
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Taluka
                </label>
                <input
                  type="text"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Village
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-blue-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="primary" size="md" className="gap-2 bg-blue-900 hover:bg-blue-800">
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Right 4 Cols: Security & Verification Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              Identity Verification Status
            </h2>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Aadhaar e-KYC Verified</span>
              </div>
              <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                Your identity is authenticated for online land mutation applications and 7/12 extract requests.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Security Tier:</span>
                <span className="font-bold text-slate-900">Level 2 (Citizen e-Gov)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Last Sign-in:</span>
                <span className="font-mono text-slate-700">{profile?.lastLogin}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Session IP:</span>
                <span className="font-mono text-slate-700">103.21.58.12 (Pune)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <KeyRound className="w-4 h-4" />
              <span>Data Protection Notice</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              All land records and uploaded deeds are encrypted and stored in compliance with the Digital Personal Data Protection (DPDP) Act, 2023.
            </p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
