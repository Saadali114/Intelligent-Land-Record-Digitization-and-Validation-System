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
import { useTranslation } from 'react-i18next';

const CONTACT_DISTRICTS = [
  { key: 'pune', defaultName: 'Pune' },
  { key: 'mumbaiCity', defaultName: 'Mumbai City' },
  { key: 'nagpur', defaultName: 'Nagpur' },
  { key: 'nashik', defaultName: 'Nashik' },
  { key: 'thane', defaultName: 'Thane' },
  { key: 'chhatrapatiSambhajinagar', defaultName: 'Chhatrapati Sambhajinagar' },
];

const CONTACT_CATEGORIES = [
  { key: 'satbaraDiscrepancy', labelKey: 'contact.categories.satbaraDiscrepancy' },
  { key: 'mutationPending', labelKey: 'contact.categories.mutationPending' },
  { key: 'surveyBoundary', labelKey: 'contact.categories.surveyBoundary' },
  { key: 'technicalIssue', labelKey: 'contact.categories.technicalIssue' },
];

export const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    district: 'pune',
    category: 'satbaraDiscrepancy',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = Date.now().toString().slice(-6);
    setTicketRef(ref);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        district: 'pune',
        category: 'satbaraDiscrepancy',
        message: '',
      });
    }, 4000);
  };

  return (
    <section id="contact" className="py-12 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-blue-800" />
            {t('navbar.contact')}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('contact.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-xl">
              <h3 className="font-bold text-base sm:text-lg text-amber-400 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400 shrink-0" />
                {t('contact.directorateTitle')}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('contact.directorateDesc')}
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-200 border-t border-slate-800">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>{t('contact.headOfficeLabel')}</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {t('contact.headOfficeValue')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <strong>{t('contact.tollFreeLabel')}</strong>
                    <p className="text-slate-400 text-[11px]">{t('contact.tollFreeValue')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <strong>{t('contact.emailLabel')}</strong>
                    <p className="text-slate-400 text-[11px]">support.ilrdvs@mahabhumi.gov.in</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <strong>{t('contact.workingHoursLabel')}</strong>
                    <p className="text-slate-400 text-[11px]">{t('contact.workingHoursValue')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                {t('contact.rtsGuaranteeTitle')}
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {t('contact.rtsGuaranteeDesc')}
              </p>
            </div>
          </div>

          {/* Right: Interactive Inquiry / Grievance Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xs">
            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-white rounded-xl border border-emerald-300">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">{t('contact.ticketSuccessTitle')}</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {t('contact.ticketSuccessDesc', { ref: ticketRef, defaultValue: `Your inquiry has been logged under reference ID ILRD-GRV-${ticketRef}. A revenue nodal officer will contact you within 48 hours.` })}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  {t('contact.formTitle')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {t('contact.formName')} <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder={t('contact.formNamePlaceholder')}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {t('contact.formEmail')} <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('contact.formEmailPlaceholder')}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {t('contact.formPhone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t('contact.formPhonePlaceholder')}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {t('common.district')}
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    >
                      {CONTACT_DISTRICTS.map((d) => (
                        <option key={d.key} value={d.key}>
                          {t(`districts.${d.key}`, d.defaultName)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {t('contact.formSubject')}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    >
                      {CONTACT_CATEGORIES.map((c) => (
                        <option key={c.key} value={c.key}>
                          {t(c.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('contact.formMessage')} <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('contact.formMessagePlaceholder')}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold transition-colors shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('contact.sendButton')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
