'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Keyboard,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  HelpCircle,
  ArrowLeft,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { MainNavbar, SubNavbar, LandingFooter } from '../../components/landing';

export default function ScreenReaderAccessPage() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [speakingSection, setSpeakingSection] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeakingSection(null);
    }
  };

  const speakText = (text: string, sectionName: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.lang = 'en-IN';

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setSpeakingSection(sectionName);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeakingSection(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeakingSection(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const togglePause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const screenReaders = [
    {
      name: 'NonVisual Desktop Access (NVDA)',
      website: 'https://www.nvaccess.org/download/',
      os: 'Windows (XP and above)',
      free: true,
      description: 'Free and open-source screen reader for Windows with comprehensive multilingual voice support.',
    },
    {
      name: 'Windows Narrator',
      website: 'https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-1c4f-131f-edd3-31230c7e3f6a',
      os: 'Windows 10 / Windows 11',
      free: true,
      description: 'Built-in Windows screen reader. Press Win + Ctrl + Enter to toggle on or off immediately.',
    },
    {
      name: 'JAWS (Job Access With Speech)',
      website: 'https://www.freedomscientific.com/products/software/jaws/',
      os: 'Windows',
      free: false,
      description: 'Widely adopted commercial screen reader for professional workplace and government environments.',
    },
    {
      name: 'Apple VoiceOver',
      website: 'https://www.apple.com/accessibility/vision/',
      os: 'macOS, iOS, iPadOS',
      free: true,
      description: 'Built-in gesture and keyboard-driven screen reader on all Apple devices. Toggle via Cmd + F5.',
    },
    {
      name: 'Google TalkBack',
      website: 'https://support.google.com/accessibility/android/answer/6283677',
      os: 'Android (All modern versions)',
      free: true,
      description: 'Built-in spoken feedback for Android smartphones and tablets via Accessibility settings.',
    },
    {
      name: 'Orca',
      website: 'https://help.gnome.org/users/orca/stable/',
      os: 'Linux / GNOME',
      free: true,
      description: 'Free open-source screen reader and magnifier for Linux desktops.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      <MainNavbar />
      <SubNavbar />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Page Header */}
        <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Accessibility Information</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  Screen Reader Access
                </h1>
                <p className="text-sm text-slate-300 max-w-2xl">
                  Information on assistive technology support, screen readers, keyboard navigation,
                  and built-in audio narration in compliance with GIGW 3.0 and WCAG 2.1 Level AA.
                </p>
              </div>

              {/* Built-in Player Trigger */}
              <button
                type="button"
                onClick={() =>
                  speakText(
                    'Screen Reader Access Page. The Intelligent Land Record Digitization and Validation System conforms to the Web Content Accessibility Guidelines WCAG 2.1 Level AA and the Guidelines for Indian Government Websites GIGW 3.0. This page provides download links for supported screen reader software and keyboard navigation instructions.',
                    'Header Overview'
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Listen to Page Summary</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Speech Controls floating bar if active */}
        {(isSpeaking || isPaused) && (
          <div className="sticky top-0 z-40 bg-amber-500 text-slate-950 px-4 py-3 shadow-md flex items-center justify-between border-b border-amber-600">
            <div className="max-w-5xl mx-auto w-full flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>
                  {isPaused ? 'Speech Paused' : `Reading aloud: ${speakingSection || 'Section'}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePause}
                  className="px-3 py-1 rounded-lg bg-slate-950 text-white text-xs font-bold flex items-center gap-1"
                >
                  {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                <button
                  type="button"
                  onClick={stopSpeech}
                  className="px-3 py-1 rounded-lg bg-red-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Square className="w-3 h-3 fill-white" />
                  <span>Stop</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
          {/* Section 1: Accessibility Statement */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Compliance & Accessibility Statement</span>
              </h2>
              <button
                type="button"
                onClick={() =>
                  speakText(
                    'Compliance and Accessibility Statement. The ILRDVS portal is designed to be accessible to all citizens, including people with visual, motor, auditory, or cognitive disabilities. The system adheres to WCAG 2.1 Level AA and GIGW 3.0 standards.',
                    'Compliance Statement'
                  )
                }
                className="text-xs text-blue-900 hover:text-blue-700 font-bold flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              The Intelligent Land Record Digitization and Validation System (ILRDVS) is committed to
              ensuring that its portal is accessible to all users, regardless of device, technology, or
              ability. It has been built to conform to the <strong>World Wide Web Consortium (W3C) Web
              Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> and the{' '}
              <strong>Guidelines for Indian Government Websites (GIGW) 3.0</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>High Contrast & Resizing</span>
                </div>
                <p className="text-xs text-slate-500">
                  Built-in A-, A, A+ text scaling without breaking responsive grid layouts.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Full Keyboard Navigation</span>
                </div>
                <p className="text-xs text-slate-500">
                  Logical tab order, skip links, and focus indicators on every interactive control.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Semantic ARIA Markups</span>
                </div>
                <p className="text-xs text-slate-500">
                  Distinct landmark roles, live regions for form updates, and descriptive alt text.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Compatible Screen Readers Table */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-800" />
                <span>Compatible Screen Readers Matrix</span>
              </h2>
              <button
                type="button"
                onClick={() =>
                  speakText(
                    'Compatible Screen Readers Matrix. The portal supports NVDA for Windows, Windows Narrator, JAWS, Apple VoiceOver for Mac and iPhone, Google TalkBack for Android, and Orca for Linux.',
                    'Screen Readers Matrix'
                  )
                }
                className="text-xs text-blue-900 hover:text-blue-700 font-bold flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </button>
            </div>

            <p className="text-sm text-slate-600">
              Citizens can access this website using any of the following standard screen readers:
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">Screen Reader</th>
                    <th className="py-3 px-4">Supported OS</th>
                    <th className="py-3 px-4">Cost</th>
                    <th className="py-3 px-4">Download / Activation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {screenReaders.map((sr, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{sr.name}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{sr.description}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{sr.os}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            sr.free
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sr.free ? 'Free' : 'Commercial'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={sr.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-800 hover:text-blue-600 font-bold hover:underline"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Keyboard Shortcuts & Access Keys */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-indigo-700" />
              <span>Keyboard Access & Navigation Shortcuts</span>
            </h2>
            <p className="text-sm text-slate-600">
              Users who prefer keyboard navigation can utilize the following keys:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                {
                  key: 'Tab',
                  desc: 'Move forward to the next interactive link, input, or control on the page.',
                },
                {
                  key: 'Shift + Tab',
                  desc: 'Move backward to the previously focused link or interactive control.',
                },
                {
                  key: 'Enter / Space',
                  desc: 'Activate links, submit forms, or expand/collapse FAQ accordions.',
                },
                {
                  key: 'Alt + S',
                  desc: 'Quickly open the built-in Screen Reader Access dialog from any page.',
                },
                {
                  key: 'Alt + 1 / Tab at top',
                  desc: 'Activate "Skip to Main Content" to bypass the header and navigation links.',
                },
                {
                  key: 'Esc',
                  desc: 'Dismiss any active modal dialogs, language selectors, or mobile menus.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                >
                  <span className="px-2.5 py-1 rounded bg-white border border-slate-300 font-mono text-xs font-bold text-slate-900 shadow-2xs shrink-0">
                    {item.key}
                  </span>
                  <span className="text-xs text-slate-600 leading-relaxed">{item.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Assistance & Grievances */}
          <section className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-slate-900">
                Encountering an accessibility barrier?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Please notify our State Revenue Accessibility Officer. We welcome suggestions to improve
                the digital inclusion of land governance for all citizens.
              </p>
            </div>

            <Link
              href="/#contact"
              className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              Report Accessibility Issue
            </Link>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
