import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'What is Village Form 7/12 (Satbara Extract) and how is it used?',
      answer:
        'Village Form 7/12 (Satbara Extract) is an official register of rights maintained by the state revenue department. Form 7 contains ownership details, survey and Gat numbers, and land tenancy classifications. Form 12 details crops grown, irrigated areas, and potkharaba (uncultivable land). It is the legal title proof required for land sales, bank agricultural loans, and succession claims.',
      category: 'Land Records',
    },
    {
      question: 'How does the AI OCR Pipeline recognize aged, handwritten Marathi records?',
      answer:
        'ILRDVS employs a specialized multi-stage pipeline: (1) OpenCV adaptive binarization, noise removal, and deskewing; (2) EasyOCR deep convolutional neural networks with language models trained on cursive Devanagari script; and (3) Spatial Named Entity Recognition (NER) that automatically categorizes fields into owner names, survey numbers, khata numbers, and plot areas with confidence scoring.',
      category: 'AI Technology',
    },
    {
      question: 'How do I verify the authenticity of a land document on this portal?',
      answer:
        'Citizens and legal practitioners can upload any scanned land document or PDF into the Document Registry or Verification Workstation. The system calculates an SHA-256 cryptographic fingerprint, compares extracted attributes with our verified repository, and validates whether the document holds an active Circle Officer sanction seal.',
      category: 'Verification',
    },
    {
      question: 'What is Village Form 6 Mutation (Ferfar) and what is the clearance SLA?',
      answer:
        'Form 6 Mutation Register (फेरफार नोंदवही) records any legal title alteration—such as sale deed conveyance, inheritance (वारस नोंद), partition, or mortgage release. Under the Right to Services (RTS) Act, uncontested mutations are mandated to be inspected and certified within 15 working days by the local Talathi and Circle Officer.',
      category: 'Mutation',
    },
    {
      question: 'What is the difference between rural 7/12 Satbara and urban Property Cards?',
      answer:
        'Village Form 7/12 applies to revenue villages and agricultural land governed under the Maharashtra Land Revenue Code 1966. Urban Property Cards (नगर भूमापन मिळकत पत्रिका) are maintained by the City Survey Office (CTSO) for non-agricultural plots and municipal municipal areas, referencing City Survey (CTS) numbers and carpet plot dimensions.',
      category: 'Land Records',
    },
    {
      question: 'How does ILRDVS prevent fraudulent double registration and title disputes?',
      answer:
        'Every parcel is indexed by unique geospatial Survey/Khasra/Khata tuples. When a new deed or mutation is ingested, the system executes real-time duplicate similarity checks across active records, immediately flagging any overlapping deed allocations, seller impersonation, or unreleased bank encumbrances.',
      category: 'Security',
    },
    {
      question: 'How do I submit a grievance if my land record contains typographical errors?',
      answer:
        'You can register an online grievance through our Citizen Corner or Contact section below. Revenue inspectors review original physical settlement records, correct typographical spelling errors in the Verification Workstation, and issue an updated, certified digital extract with complete audit logging.',
      category: 'Grievance',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-blue-800" />
            Citizen Knowledge Base
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Answers to common questions regarding land records, digital 7/12 extracts, and mutation verification.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-900' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    <p>{faq.answer}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-800 uppercase px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
