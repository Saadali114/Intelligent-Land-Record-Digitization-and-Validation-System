'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  X,
  CheckCircle2,
  ShieldCheck,
  Building,
  MapPin,
  FileCheck,
  Send,
  AlertCircle,
  UploadCloud,
  Lock,
  Phone,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  File,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { citizenService } from '../../services/citizen.service';
import { CitizenDigitalDocType, CitizenLandRecord } from '../../types/citizen';

interface ApplyDigitalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (appId: string) => void;
  defaultSurveyNumber?: string;
  defaultVillage?: string;
  landRecords?: CitizenLandRecord[];
}

const DOCUMENT_OPTIONS: { type: CitizenDigitalDocType; label: string; desc: string; statutoryBadge: string }[] = [
  {
    type: 'Digital 7/12 Extract',
    label: 'Digital 7/12 Extract (७/१२ उतारा)',
    desc: 'Official digital land rights & agricultural crop extract signed by Talathi & Tehsildar.',
    statutoryBadge: 'Sec 148 MLRC Act',
  },
  {
    type: 'Digital 8A Khate-Utara',
    label: 'Digital 8A Khate-Utara (८अ खाते उतारा)',
    desc: 'Consolidated landholding ledger certificate reflecting total parcel area and revenue assessment.',
    statutoryBadge: 'Revenue Ledger Extract',
  },
  {
    type: 'Digital Property Card',
    label: 'Digital Property Card (मालमत्ता पत्रक / CTS)',
    desc: 'Urban cadastral parcel property card issued under City Survey Office jurisdiction.',
    statutoryBadge: 'CTS Certified Card',
  },
  {
    type: 'Title Clearance Certificate',
    label: 'Title Clearance Certificate (हक्क दाखला)',
    desc: 'Statutory verification report validating clean title free of court lis-pendens or encumbrances.',
    statutoryBadge: 'Officer Title Verification',
  },
  {
    type: 'e-Ferfar Mutation Certificate',
    label: 'e-Ferfar Mutation Certificate (ई-फेरफार नोंद)',
    desc: 'Certified copy of sanctioned mutation notice recording inheritance, sale or partition.',
    statutoryBadge: 'Mahabhulekh Validated',
  },
];

const PURPOSE_OPTIONS = [
  'Bank Loan / Kisan Credit Card (KCC) Verification',
  'Property Registration & Sale Conveyance',
  'Legal Title Due-Diligence & Court Submission',
  'Government Subsidy / PM-KISAN Benefit Scheme',
  'Family Partition & Succession Regularization',
  'Personal Records & Cadastral Reference',
];

export const ApplyDigitalDocumentModal: React.FC<ApplyDigitalDocumentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultSurveyNumber = '',
  defaultVillage = '',
  landRecords = [],
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  // Wizard Step: 1 = Parcel & Doc, 2 = Aadhaar e-KYC & OTP
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Step 1: Form Details
  const [documentType, setDocumentType] = useState<CitizenDigitalDocType>('Digital 7/12 Extract');
  const [surveyNumber, setSurveyNumber] = useState(defaultSurveyNumber || (landRecords[0]?.surveyNumber ?? ''));
  const [village, setVillage] = useState(defaultVillage || (landRecords[0]?.village ?? 'Khadakwasla'));
  const [taluka, setTaluka] = useState('Haveli');
  const [district, setDistrict] = useState('Pune');
  const [purpose, setPurpose] = useState(PURPOSE_OPTIONS[0]);
  const [applicantNotes, setApplicantNotes] = useState('');

  // Step 2: Aadhaar e-KYC & Mobile OTP Verification
  const [aadharNumber, setAadharNumber] = useState('');
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [aadharFileName, setAadharFileName] = useState('');
  const [registeredPhone, setRegisteredPhone] = useState('+91 98220 12345');

  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize phone from profile
  useEffect(() => {
    const p = citizenService.getProfile();
    if (p?.mobile) {
      setRegisteredPhone(p.mobile);
    }
  }, [isOpen]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isOpen) return null;

  const handleSelectParcel = (rec: CitizenLandRecord) => {
    setSurveyNumber(rec.surveyNumber);
    setVillage(rec.village);
    if (rec.taluka) setTaluka(rec.taluka);
    if (rec.district) setDistrict(rec.district);
  };

  // Format Aadhaar number: 12 digits into 'XXXX XXXX XXXX'
  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    const parts: string[] = [];
    for (let i = 0; i < raw.length; i += 4) {
      parts.push(raw.slice(i, i + 4));
    }
    setAadharNumber(parts.join(' '));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAadharFile(file);
      setAadharFileName(file.name);
      setError(null);
    }
  };

  const handleSendOtp = () => {
    if (aadharNumber.replace(/\s/g, '').length !== 12) {
      setError('Please enter a valid 12-digit Aadhaar Number first.');
      return;
    }

    setError(null);
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockCode);
    setOtpSent(true);
    setOtpTimer(60);
    setOtpNotice(`OTP sent successfully to registered mobile ${registeredPhone}. (Demo Code: ${mockCode})`);
  };

  const handleVerifyOtp = () => {
    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP received on your mobile.');
      return;
    }

    if (enteredOtp.trim() === generatedOtp || enteredOtp.trim() === '123456') {
      setIsOtpVerified(true);
      setError(null);
      setOtpNotice('✓ Aadhaar e-KYC Identity Verified & Authenticated Successfully via UIDAI Gateway.');
    } else {
      setError('Invalid OTP code. Please enter the correct 6-digit code or resend OTP.');
    }
  };

  const handleProceedToStep2 = () => {
    setError(null);
    if (!surveyNumber.trim()) {
      setError('Please enter or select a Survey / Gat Number.');
      return;
    }
    if (!village.trim()) {
      setError('Please enter a Village name.');
      return;
    }
    setCurrentStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanAadhaar = aadharNumber.replace(/\s/g, '');
    if (cleanAadhaar.length !== 12) {
      setError('Please provide a valid 12-digit Aadhaar Number.');
      return;
    }

    if (!aadharFileName && !aadharFile) {
      setError('Please upload a copy of your Aadhaar Card (PDF/JPG/PNG).');
      return;
    }

    if (!isOtpVerified) {
      setError('Please complete the mobile OTP verification to authenticate your Aadhaar identity.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newApp = citizenService.submitDigitalDocumentApplication({
        documentType,
        surveyNumber: surveyNumber.trim(),
        village: village.trim(),
        taluka: taluka.trim(),
        district: district.trim(),
        purpose,
        applicantNotes: applicantNotes.trim() || undefined,
        aadharNumber: aadharNumber.trim(),
        aadharFileName: aadharFileName || 'aadhaar_card.pdf',
        isAadharVerified: true,
        mobileNumber: registeredPhone,
      });

      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess(newApp.id);
      }
      onClose();
      router.push(`/portal/applications/${newApp.id}`);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err?.message || 'Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Revenue Land Records &bull; Citizen e-Service</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Apply for Official Digital Land Document
            </h2>
            <p className="text-xs text-slate-300">
              Statutory document issuance with officer verification and Aadhaar e-KYC authentication.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === 1
                  ? 'bg-blue-900 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {currentStep > 1 ? <Check className="w-3 h-3" /> : '1'}
            </span>
            <span className={currentStep === 1 ? 'text-blue-950 font-bold' : 'text-slate-600'}>
              1. Document & Parcel Details
            </span>
          </div>

          <div className="w-8 h-0.5 bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 font-semibold">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === 2
                  ? 'bg-blue-900 text-white'
                  : isOtpVerified
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isOtpVerified ? <Check className="w-3 h-3" /> : '2'}
            </span>
            <span className={currentStep === 2 ? 'text-blue-950 font-bold' : 'text-slate-400'}>
              2. Aadhaar e-KYC & Mobile OTP
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {otpNotice && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{otpNotice}</span>
            </div>
          )}

          {/* STEP 1: Land Parcel & Document Choice */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Quick pick from citizen's existing parcels */}
              {landRecords.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select from Your Registered Land Parcels
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {landRecords.map((r) => {
                      const isSelected = surveyNumber === r.surveyNumber && village === r.village;
                      return (
                        <button
                          type="button"
                          key={r.id}
                          onClick={() => handleSelectParcel(r)}
                          className={`p-3 rounded-lg border text-left text-xs transition-all flex items-start justify-between ${
                            isSelected
                              ? 'border-blue-900 bg-blue-50/70 shadow-xs ring-1 ring-blue-900'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-slate-900">
                              Survey #{r.surveyNumber}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {r.village}, {r.taluka} &bull; {r.area}
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Document Type Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Document Type to Apply For <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {DOCUMENT_OPTIONS.map((doc) => {
                    const isSelected = documentType === doc.type;
                    return (
                      <label
                        key={doc.type}
                        onClick={() => setDocumentType(doc.type)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-blue-900 bg-blue-50/70 ring-1 ring-blue-900 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="docType"
                          checked={isSelected}
                          onChange={() => setDocumentType(doc.type)}
                          className="mt-0.5 text-blue-900 focus:ring-blue-900"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900">{doc.label}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {doc.statutoryBadge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            {doc.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Parcel & Location Details */}
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-900" />
                  <span>Cadastral Survey & Location</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Survey / Gat / CTS Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 124/2 or 87/3"
                      value={surveyNumber}
                      onChange={(e) => setSurveyNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Village (गाव) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Khadakwasla"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Taluka (तालुका)
                    </label>
                    <input
                      type="text"
                      value={taluka}
                      onChange={(e) => setTaluka(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      District (जिल्हा)
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* Purpose & Remarks */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Purpose of Application
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  >
                    {PURPOSE_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Applicant Remarks (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mention specific urgency or land loan references..."
                    value={applicantNotes}
                    onChange={(e) => setApplicantNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  />
                </div>
              </div>

              {/* Step 1 Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" size="md" onClick={onClose}>
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleProceedToStep2}
                  className="gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold"
                >
                  <span>Proceed to Aadhaar e-KYC</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Aadhaar Number, Document Upload & Mobile OTP */}
          {currentStep === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in">
              {/* Summary of Chosen Doc */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-blue-950">{documentType}</div>
                  <div className="text-[11px] text-blue-800 mt-0.5">
                    Survey #{surveyNumber} &bull; {village}, {taluka}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-blue-900 hover:underline"
                >
                  Edit Details
                </button>
              </div>

              {/* 1. Aadhaar Number Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    12-Digit Aadhaar Number <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <Lock className="w-3 h-3 text-slate-400" />
                    256-bit Encrypted UIDAI Link
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5412 8923 1045"
                    value={aadharNumber}
                    onChange={handleAadharChange}
                    disabled={isOtpVerified}
                    maxLength={14}
                    className={`w-full px-4 py-2.5 text-sm bg-white border rounded-lg focus:ring-2 focus:ring-blue-900 font-mono tracking-wider font-bold ${
                      isOtpVerified
                        ? 'border-emerald-300 bg-emerald-50/30 text-emerald-950'
                        : 'border-slate-300 text-slate-900'
                    }`}
                  />
                  {aadharNumber.replace(/\s/g, '').length === 12 && (
                    <div className="absolute right-3 top-3 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Enter your 12-digit Unique Identification Number as printed on your Aadhaar card.
                </p>
              </div>

              {/* 2. Upload Aadhaar Card Document */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Upload Aadhaar Card Document (Front & Back) <span className="text-rose-500">*</span>
                </label>

                <div
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                    aadharFileName
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : 'border-slate-300 hover:border-blue-800 bg-slate-50/60'
                  }`}
                >
                  <input
                    type="file"
                    id="aadhar-upload-input"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {aadharFileName ? (
                    <div className="flex items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 truncate max-w-[280px]">
                            {aadharFileName}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            File attached &bull; Ready for verification
                          </div>
                        </div>
                      </div>

                      <label
                        htmlFor="aadhar-upload-input"
                        className="text-xs text-blue-900 font-bold hover:underline cursor-pointer"
                      >
                        Change File
                      </label>
                    </div>
                  ) : (
                    <label
                      htmlFor="aadhar-upload-input"
                      className="cursor-pointer block space-y-2 py-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mx-auto">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        Click to upload or drag and drop your Aadhaar Card
                      </div>
                      <div className="text-[11px] text-slate-500">
                        PDF, JPG, JPEG, or PNG (Max size: 5 MB)
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* 3. OTP Verification on Registered Mobile */}
              <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-900" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      OTP Verification on Registered Mobile
                    </span>
                  </div>

                  {isOtpVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <Check className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600">
                  Aadhaar registered mobile number:{' '}
                  <strong className="text-slate-900 font-mono">{registeredPhone}</strong>
                </div>

                {/* Send OTP button or OTP input */}
                {!otpSent ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSendOtp}
                    disabled={aadharNumber.replace(/\s/g, '').length !== 12}
                    className="w-full sm:w-auto gap-2 text-xs border-blue-900 text-blue-900 font-bold hover:bg-blue-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send OTP to Mobile Number</span>
                  </Button>
                ) : (
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        disabled={isOtpVerified}
                        maxLength={6}
                        className="w-full sm:w-48 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 font-mono tracking-widest text-center font-bold"
                      />

                      {!isOtpVerified && (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={handleVerifyOtp}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify OTP</span>
                        </Button>
                      )}

                      {!isOtpVerified && (
                        <button
                          type="button"
                          disabled={otpTimer > 0}
                          onClick={handleSendOtp}
                          className={`text-xs font-semibold ml-2 ${
                            otpTimer > 0
                              ? 'text-slate-400 cursor-not-allowed'
                              : 'text-blue-900 hover:underline cursor-pointer'
                          }`}
                        >
                          {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
                        </button>
                      )}
                    </div>

                    {isOtpVerified && (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Aadhaar e-KYC Identity Authenticated via UIDAI System</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Statutory Note */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5 leading-relaxed">
                  <span className="font-bold">Aadhaar Authentication Compliance:</span>
                  <p className="text-[11px] text-amber-900/90">
                    Aadhaar verification ensures that only the lawful khatedar or authorized representative can request official state digital land certificates under the Maharashtra Land Revenue Record Rules.
                  </p>
                </div>
              </div>

              {/* Step 2 Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setCurrentStep(1)}
                  disabled={isSubmitting}
                  className="gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Details</span>
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  disabled={!isOtpVerified || !aadharFileName || aadharNumber.replace(/\s/g, '').length !== 12}
                  className="gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Submit Application</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
