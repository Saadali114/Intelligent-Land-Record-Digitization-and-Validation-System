'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface FaqItem {
  id: number;
  category: 'ALL' | 'LAND_STACK' | 'AI_OCR' | 'VERIFICATION' | 'SECURITY';
  tag: string;
  tagColor: string;
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<number | null>(1);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterTabs = [
    { key: 'ALL', label: 'All Questions' },
    { key: 'LAND_STACK', label: '8-Layer Land Stack & ULPIN' },
    { key: 'AI_OCR', label: 'AI OCR & Digitization' },
    { key: 'VERIFICATION', label: 'Verification & Mutation' },
    { key: 'SECURITY', label: 'Anti-Fraud & Security' },
  ];

  const faqList: FaqItem[] = [
    {
      id: 1,
      category: 'LAND_STACK',
      tag: '8-LAYER LAND STACK',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      question: 'What is the DILRMP 3.0 (2026–2031) 8-Layer Land Stack?',
      answer:
        'The DILRMP 3.0 8-Layer Land Stack unifies 8 previously disconnected registries: L1 (Vector Maps), L2 (Record of Rights 7/12 & 8-A), L3 (IGR Registration Deeds), L4 (Land Use & Statutory Zoning), L5 (MAHACity Urban Property), L6 (Bank Liens), L7 (RCCMS Revenue Court Disputes), and L8 (Ready Reckoner Valuation). This eliminates paper-based verification and creates a deterministic single source of truth.',
    },
    {
      id: 2,
      category: 'LAND_STACK',
      tag: 'BHU-AADHAAR (ULPIN)',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
      question: 'What is the 14-digit Bhu-Aadhaar (ULPIN) and how is it assigned?',
      answer:
        'The Unique Land Parcel Identification Number (ULPIN), known as Bhu-Aadhaar, is a 14-digit alphanumeric geocoded number generated from the latitude and longitude vertices of each parcel based on WGS-84 coordinate standards. It acts as an immutable digital DNA for land, preventing boundary disputes and fictitious transactions.',
    },
    {
      id: 3,
      category: 'AI_OCR',
      tag: 'AI PIPELINE & OCR',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      question: 'How does the AI OCR Pipeline recognize aged, handwritten Marathi records?',
      answer:
        'Our custom vision transformer engine combines OpenCV morphological cleaning (despeckling, deskewing, and contrast normalization) with EasyOCR and TrOCR models fine-tuned on archival 18th-century Peshwa Modi script and handwritten Devanagari. It reaches 98.4%+ extraction accuracy on yellowed parchment deeds.',
    },
    {
      id: 4,
      category: 'VERIFICATION',
      tag: 'SATBARA 7/12',
      tagColor: 'bg-stone-100 text-stone-700 border-stone-200',
      question: 'What is Village Form 7/12 (Satbara Extract) and how is it used?',
      answer:
        'Village Form 7/12 (गावनिहाय सातबारा) is the statutory Record of Rights (RoR) under the Maharashtra Land Revenue Code (MLRC) 1966. Form 7 contains ownership, occupants, and tenancy rights, while Form 12 details crop cultivation, water sources, and agricultural liabilities. Certified copies are cryptographically signed with QR verification.',
    },
    {
      id: 5,
      category: 'VERIFICATION',
      tag: 'MUTATION (FERFAR)',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
      question: 'What is Form 6 Mutation (Ferfar) and what is the clearance SLA?',
      answer:
        'Form 6 (फेरफार नोंदवही) records all alterations in land ownership arising from sale deeds, heir-ship inheritances, partitions, or court decrees. Under the Maharashtra Right to Public Services Act (RTS), a 15-day public objection notice is published online (e-Chawadi), after which Circle Officers sanction the mutation.',
    },
    {
      id: 6,
      category: 'LAND_STACK',
      tag: 'URBAN PROPERTY CARD',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      question: 'What is the difference between a 7/12 Satbara and Urban Property Cards?',
      answer:
        'A 7/12 extract is issued for rural and agricultural land under the Talathi jurisdiction, while an Urban Property Card (Milkat Patra / CTS Card) is issued by City Survey Offices for non-agricultural plots, gaothan properties, and municipal urban land parcels.',
    },
    {
      id: 7,
      category: 'SECURITY',
      tag: 'SECURITY & ANTI-FRAUD',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      question: 'How does ILRDVS prevent fraudulent double registration and distress sales?',
      answer:
        'Whenever an applicant submits a deed or mutation, ILRDVS conducts automated real-time cross-checks across Layer 3 (IGR Registration), Layer 6 (RBI CERSAI Banking Liens), and Layer 7 (RCCMS Revenue Court Injunctions). If any active injunction or existing buyer lien exists, the system flags the collision and halts registration instantaneously.',
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqList.filter((item) => {
      const matchesCategory =
        activeCategory === 'ALL' || item.category === activeCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section
      id="faq"
      data-purpose="faq-section"
      className="py-16 border-t border-stone-200 bg-white select-none"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-1 bg-emerald-100 text-sovereign-800 font-mono text-[11px] px-3 py-1 rounded-full uppercase tracking-wider font-semibold mb-2 border border-emerald-200">
            <span>💡</span>
            <span>CITIZEN KNOWLEDGE BASE &amp; FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Find answers regarding the 8-Layer Land Stack, Bhu-Aadhaar (ULPIN), 7/12 Satbara extracts, Form 6 mutations, and AI cadastral verification.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., 8-layer stack, Bhu-Aadhaar, mutation, OCR)..."
            className="w-full bg-white border border-stone-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm shadow-2xs focus:ring-1 focus:ring-sovereign-800 focus:border-sovereign-800 outline-none"
          />
          <span className="absolute left-3.5 top-3 text-stone-400 text-xs">
            🔍
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center text-xs">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                activeCategory === tab.key
                  ? 'bg-sovereign-800 text-white'
                  : 'bg-white border border-stone-200 hover:bg-stone-100 text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-3" data-purpose="faq-accordions">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-stone-200 rounded-xl shadow-2xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center space-x-3 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold shrink-0 ${
                        isOpen
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {faq.id}
                    </span>
                    <span className="truncate">{faq.question}</span>
                  </span>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${faq.tagColor}`}
                    >
                      {faq.tag}
                    </span>
                    <span className="text-stone-400 text-xs">
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100">
                    {faq.answer}
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
