import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Shield,
  MessageSquare,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    district: 'Pune',
    category: '7/12 Discrepancy',
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
        phone: '',
        district: 'Pune',
        category: '7/12 Discrepancy',
        message: '',
      });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-blue-800" />
            Citizen Helpdesk & Grievance
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact Revenue Support & Grievance Cell
          </h2>
          <p className="text-sm text-slate-600">
            Have a question regarding your land record, pending mutation, or cadastral extract? Reach out to our 24x7 helpdesk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-xl">
              <h3 className="font-bold text-lg text-amber-400 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                State Land Records Directorate
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Centralized monitoring authority for computerized revenue records, survey maps, and dispute settlement.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-200 border-t border-slate-800">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Head Office:</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Office of the Settlement Commissioner & Director of Land Records, Central Building, Agarkar Nagar, Pune – 411001, Maharashtra, India.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <strong>Toll-Free Helpline:</strong>
                    <p className="text-slate-400 text-[11px]">1800-120-8040 (24x7 Citizen Support)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <strong>Official Email:</strong>
                    <p className="text-slate-400 text-[11px]">support.ilrdvs@mahabhumi.gov.in</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <strong>Administrative Working Hours:</strong>
                    <p className="text-slate-400 text-[11px]">Monday to Friday, 09:30 AM – 06:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-blue-700" />
                Right to Services (RTS) Guarantee:
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Under the Maharashtra Right to Public Services Act, certified digital extracts are delivered in real time, and grievance petitions are addressed within 7 working days.
              </p>
            </div>
          </div>

          {/* Right: Interactive Inquiry / Grievance Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-xs">
            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-white rounded-xl border border-emerald-300">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Grievance Ticket Registered!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your inquiry has been logged under reference ID <strong className="font-mono text-slate-900">ILRD-GRV-{Date.now().toString().slice(-6)}</strong>. A revenue nodal officer will contact you within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  Citizen Query & Grievance Registration
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Citizen Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Shankar Patil"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="citizen@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Revenue District</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    >
                      <option value="Pune">Pune</option>
                      <option value="Mumbai City">Mumbai City</option>
                      <option value="Nagpur">Nagpur</option>
                      <option value="Nashik">Nashik</option>
                      <option value="Thane">Thane</option>
                      <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Inquiry Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    >
                      <option value="7/12 Discrepancy">7/12 Extract Discrepancy</option>
                      <option value="Mutation Pending">Mutation Pending (Ferfar)</option>
                      <option value="Survey Boundary">Survey Boundary Dispute</option>
                      <option value="Technical Issue">Portal Technical Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Details of Inquiry / Grievance (Include Survey / Gat No. if applicable) <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your parcel query, Survey/Gat number, and village jurisdiction..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Submit Grievance Petition</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
