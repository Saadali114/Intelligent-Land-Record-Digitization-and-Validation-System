import React from 'react';
import {
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Award,
  Users,
  Building2,
  FileText,
} from 'lucide-react';

export const AboutUsSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-blue-700" />
            National Land Records Modernization Programme (DILRMP)
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Preserving & Safeguarding India’s Cadastral Heritage
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            ILRDVS was created to modernize millions of fragile, hand-written land records into
            structured, tamper-evident digital assets using neural computer vision and human inspector governance.
          </p>
        </div>

        {/* 2-Column Story & Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 text-sm text-slate-600 leading-relaxed">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-900" />
              The Challenge of Archival Land Records
            </h3>
            <p>
              For decades, village records including <strong className="text-slate-800">Village Form 7/12 (Satbara)</strong>,{' '}
              <strong className="text-slate-800">Mutation Registers (Ferfar)</strong>, and registered Sale Deeds were recorded on
              physical paper that suffers from yellowing, ink bleeds, tear damage, and manual transcription errors.
            </p>
            <p>
              These vulnerabilities often facilitated fraudulent double-allocations, disputes in civil courts, and delays for citizens
              seeking land verification. ILRDVS eliminates these hurdles through an end-to-end AI workflow.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xl font-black text-blue-950 font-mono">100%</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">Audit Trail Provenance</div>
                <div className="text-[11px] text-slate-500">Every edit and action is cryptographically tracked</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xl font-black text-emerald-800 font-mono">98.4%</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">OCR Extraction Accuracy</div>
                <div className="text-[11px] text-slate-500">Validated across Marathi, Hindi, and English</div>
              </div>
            </div>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-blue-500 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">OpenCV & EasyOCR</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adaptive thresholding, deskewing, and multilingual neural recognition of cursive and handwritten Devanagari script.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-emerald-500 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Spatial NER Extraction</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Heuristic cadastral parsing isolates Survey No, Khasra, Khata, Plot Area, Owner Name, and Mutation references.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-purple-500 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Inspector Workstation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dual-pane zoomable review interface enabling revenue officers to verify AI predictions before sanctioning.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-amber-500 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Tamper-Proof Certificates</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated generation of official bilingual certificates with digital seal watermarks and instant print capability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
