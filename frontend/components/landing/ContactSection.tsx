'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    district: 'Pune',
    subject: '7/12 Extract Discrepancy',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        mobile: '',
        district: 'Pune',
        subject: '7/12 Extract Discrepancy',
        message: '',
      });
    }, 5000);
  };

  return (
    <section
      id="contact"
      data-purpose="citizen-helpdesk-contact"
      className="py-16 px-4 sm:px-8 max-w-7xl mx-auto bg-white select-none"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-1 bg-emerald-100 text-sovereign-800 font-mono text-[11px] px-3 py-1 rounded-full uppercase tracking-wider font-semibold mb-2 border border-emerald-200">
          <span>📞</span>
          <span>CONTACT US</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Citizen Helpdesk &amp; Regional Offices
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm mt-1">
          Get in touch with taluka revenue inspectors, tehsildars, or our 24x7 technical helpdesk.
        </p>
      </div>

      {/* Helpdesk Layout: Left Officer Details / Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Directorate Office Card */}
        <div className="lg:col-span-5 border border-emerald-500/20 rounded-xl p-6 shadow-2xl backdrop-blur-md space-y-6 text-white bg-sovereign-800">
          <div className="flex items-center space-x-3 border-b border-stone-700/60 pb-4">
            <span className="w-10 h-10 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-lg">
              🏛️
            </span>
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                State Land Records Directorate
              </h3>
              <p className="text-[11px] text-stone-300">
                Centralized monitoring authority for revenue settlements, survey maps, and dispute settlement.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start space-x-3">
              <span className="text-stone-400 text-sm">📍</span>
              <div>
                <strong className="text-stone-200 block">HEAD OFFICE:</strong>
                <span className="text-stone-300 leading-relaxed">
                  Office of the Settlement Commissioner &amp; Director of Land Records, Central Building, Agarkar Nagar, Pune – 411001, Maharashtra, India.
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-stone-400 text-sm">📞</span>
              <div>
                <strong className="text-stone-200 block">Toll-Free Helpline:</strong>
                <span className="text-gold-400 font-mono">1800-120-8040 (24×7 Citizen Support)</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-stone-400 text-sm">✉️</span>
              <div>
                <strong className="text-stone-200 block">Official Email:</strong>
                <span className="text-stone-300 font-mono">support.ilrdvs@mahabhumi.gov.in</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-stone-400 text-sm">⏰</span>
              <div>
                <strong className="text-stone-200 block">Administration Working Hours:</strong>
                <span className="text-stone-300">Monday to Friday, 09:30 AM – 06:00 PM IST</span>
              </div>
            </div>
          </div>

          {/* Guarantee Note */}
          <div className="bg-gold-950/40 border border-gold-600/30 p-3 rounded-lg text-[11px] text-stone-300 flex items-start space-x-2.5">
            <span className="text-gold-400 text-sm">🛡️</span>
            <div className="leading-snug">
              <strong className="text-gold-400 font-semibold">
                Right to Services (RTS) Guarantee:
              </strong>{' '}
              Under the Maharashtra Right to Public Services Act, certified digital extracts are delivered in real-time, and grievance petitions are addressed within 7 working days.
            </div>
          </div>
        </div>

        {/* Right: Inquiry / Grievance Form */}
        <div
          data-purpose="inquiry-form"
          className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-6 shadow-xs"
        >
          <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
            Send an Inquiry or Grievance
          </h3>
          <p className="text-xs text-stone-500 mb-5">
            Fill in the details below to reach the nodal officer for your revenue division.
          </p>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
              <div className="text-3xl">✓</div>
              <h4 className="font-serif font-bold text-base text-stone-900">
                Inquiry Submitted Successfully
              </h4>
              <p className="text-xs text-stone-600">
                Your petition has been routed to the respective district nodal officer.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Shankar Patil"
                    className="w-full text-xs rounded border border-stone-300 px-3 py-2 focus:ring-1 focus:ring-sovereign-800 focus:border-sovereign-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="citizen@example.com"
                    className="w-full text-xs rounded border border-stone-300 px-3 py-2 focus:ring-1 focus:ring-sovereign-800 focus:border-sovereign-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs rounded border border-stone-300 px-3 py-2 focus:ring-1 focus:ring-sovereign-800 focus:border-sovereign-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    District
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full text-xs rounded border border-stone-300 px-3 py-2 bg-white focus:ring-1 focus:ring-sovereign-800 focus:border-sovereign-800 outline-none"
                  >
                    <option>Pune</option>
                    <option>Nagpur</option>
                    <option>Nashik</option>
                    <option>Chhatrapati Sambhajinagar</option>
                    <option>Thane</option>
                    <option>Kolhapur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs rounded border border-stone-300 px-3 py-2 bg-white focus:ring-1 focus:ring-sovereign-800 focus:border-sovereign-800 outline-none"
                  >
                    <option>7/12 Extract Discrepancy</option>
                    <option>Mutation (Ferfar) Delay</option>
                    <option>Bhu-Aadhaar Verification</option>
                    <option>Cadastral Map Boundary Check</option>
                    <option>Technical Helpdesk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Message / Grievance Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide your Survey Number, Village, and a detailed description of the issue..."
                  className="w-full text-xs rounded border border-stone-300 px-3 py-2 focus:ring-1 focus:ring-sovereign-800 focus:border-sovereign-800 outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-sovereign-800 hover:bg-sovereign-700 text-white font-bold text-xs px-6 py-2.5 rounded shadow-sm flex items-center space-x-2 transition-colors border border-emerald-500/30 cursor-pointer"
              >
                <span>✉️</span>
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
