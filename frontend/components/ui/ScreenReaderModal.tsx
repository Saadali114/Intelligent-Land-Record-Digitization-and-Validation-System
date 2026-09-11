'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  X,
  ExternalLink,
  Keyboard,
  Info,
  CheckCircle2,
  Sparkles,
  Sliders,
  Globe,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ScreenReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScreenReaderModal: React.FC<ScreenReaderModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'tts' | 'software' | 'shortcuts'>('tts');

  // Text-To-Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [speechPitch, setSpeechPitch] = useState<number>(1);
  const [speakingTextSnippet, setSpeakingTextSnippet] = useState<string>('');
  const [supported, setSupported] = useState(true);

  // Focus trap ref
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setSupported(false);
    }
  }, []);

  // Keyboard shortcut: Alt + S or Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Clean up speech on unmount
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
      setSpeakingTextSnippet('');
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    // Detect language
    const currentLang = i18n.language || 'en';
    if (currentLang.startsWith('hi')) {
      utterance.lang = 'hi-IN';
    } else if (currentLang.startsWith('mr')) {
      utterance.lang = 'mr-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setSpeakingTextSnippet(text.slice(0, 140) + (text.length > 140 ? '...' : ''));
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeakingTextSnippet('');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeakingTextSnippet('');
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

  const handleReadSummary = () => {
    const summary =
      'Welcome to the Intelligent Land Record Digitization and Validation System. ' +
      'An initiative under the Digital India Land Records Modernization Programme DILRMP 3.0. ' +
      'The platform features the Unified 8-Layer Land Stack, 14-digit Bhu-Aadhaar ULPIN, ' +
      'AI OCR pipeline for historical Modi and Devanagari extracts, automated Form 6 mutations, ' +
      'and triple anti-fraud gateways. Press Tab to browse services, or explore options below.';
    speakText(summary);
  };

  const handleReadFullPage = () => {
    const mainEl = document.getElementById('main-content') || document.body;
    const text = mainEl.innerText.replace(/\s+/g, ' ').slice(0, 3000);
    speakText(text);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in-50 duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="screen-reader-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="screen-reader-title" className="text-base font-bold text-white flex items-center gap-2">
                <span>Screen Reader & Accessibility Access</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black uppercase">
                  GIGW 3.0 / WCAG 2.1
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Assistive tools, live speech synthesis, and screen reader guidelines
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('tts')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'tts'
                ? 'border-blue-900 text-blue-950 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Built-in Text-To-Speech</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('software')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'software'
                ? 'border-blue-900 text-blue-950 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-blue-700" />
            <span>Screen Reader Software</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shortcuts')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'shortcuts'
                ? 'border-blue-900 text-blue-950 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-emerald-700" />
            <span>Keyboard Shortcuts</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm">
          {/* TAB 1: TEXT-TO-SPEECH */}
          {activeTab === 'tts' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-950 text-sm">
                  <Volume2 className="w-4 h-4 text-blue-800" />
                  <span>Browser Audio Narration (Web Speech API)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Citizens without third-party screen reader software installed can listen to the portal
                  using our browser-native speech synthesizer. Works on Chrome, Edge, Safari, and Firefox.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleReadSummary}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Play className="w-4 h-4 text-amber-400" />
                  <span>Read Page Overview & Summary</span>
                </button>

                <button
                  type="button"
                  onClick={handleReadFullPage}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs border border-slate-300 transition-colors"
                >
                  <Play className="w-4 h-4 text-blue-900" />
                  <span>Read Main Page Content</span>
                </button>
              </div>

              {/* Speech Controls & Active Status */}
              {(isSpeaking || isPaused) && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3 animate-in fade-in-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-amber-950 text-xs">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
                      </span>
                      <span>{isPaused ? 'Speech Paused' : 'Currently Speaking...'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={togglePause}
                        className="px-2.5 py-1 rounded bg-white hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 flex items-center gap-1"
                      >
                        {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                        <span>{isPaused ? 'Resume' : 'Pause'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={stopSpeech}
                        className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <Square className="w-3 h-3 fill-white" />
                        <span>Stop</span>
                      </button>
                    </div>
                  </div>

                  {speakingTextSnippet && (
                    <p className="text-xs text-amber-900 italic bg-white/80 p-2.5 rounded-lg border border-amber-200">
                      &quot;{speakingTextSnippet}&quot;
                    </p>
                  )}
                </div>
              )}

              {/* Speed / Voice Rate Configuration */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>Speech Speed:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[
                    { label: '0.8x Slow', val: 0.8 },
                    { label: '1.0x Normal', val: 1.0 },
                    { label: '1.25x Fast', val: 1.25 },
                  ].map((rate) => (
                    <button
                      key={rate.val}
                      type="button"
                      onClick={() => setSpeechRate(rate.val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        speechRate === rate.val
                          ? 'bg-blue-900 text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {rate.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOFTWARE MATRIX */}
          {activeTab === 'software' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                The ILRDVS portal complies with World Wide Web Consortium (W3C) Web Content
                Accessibility Guidelines (WCAG) 2.1 Level AA and GIGW 3.0. It is fully compatible with
                the following industry-standard screen readers:
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">Screen Reader</th>
                      <th className="py-2.5 px-3">Platform</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Quick Activation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        NVDA (NonVisual Desktop Access)
                      </td>
                      <td className="py-2.5 px-3">Windows</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-semibold">Free / Open Source</td>
                      <td className="py-2.5 px-3">
                        <a
                          href="https://www.nvaccess.org/download/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:underline inline-flex items-center gap-1 font-bold"
                        >
                          nvaccess.org <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">Windows Narrator</td>
                      <td className="py-2.5 px-3">Windows 10 / 11</td>
                      <td className="py-2.5 px-3 text-blue-700 font-semibold">Built-in OS</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                        Win + Ctrl + Enter
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">JAWS (Job Access With Speech)</td>
                      <td className="py-2.5 px-3">Windows</td>
                      <td className="py-2.5 px-3 text-amber-700 font-semibold">Commercial</td>
                      <td className="py-2.5 px-3">
                        <a
                          href="https://www.freedomscientific.com/products/software/jaws/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:underline inline-flex items-center gap-1 font-bold"
                        >
                          freedomscientific.com <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">Apple VoiceOver</td>
                      <td className="py-2.5 px-3">macOS / iOS</td>
                      <td className="py-2.5 px-3 text-blue-700 font-semibold">Built-in OS</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                        Cmd + F5 / Triple-click side button
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">Google TalkBack</td>
                      <td className="py-2.5 px-3">Android</td>
                      <td className="py-2.5 px-3 text-blue-700 font-semibold">Built-in OS</td>
                      <td className="py-2.5 px-3 text-slate-600">Settings &gt; Accessibility</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: KEYBOARD SHORTCUTS */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                You can navigate this portal efficiently without a mouse using the following standard
                keyboard shortcuts:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: 'Tab', desc: 'Navigate forward through interactive links and fields' },
                  { key: 'Shift + Tab', desc: 'Navigate backwards to previous interactive element' },
                  { key: 'Enter / Space', desc: 'Activate selected button, link, or accordion' },
                  { key: 'Alt + S', desc: 'Open / toggle this Screen Reader Access dialog' },
                  { key: 'Esc', desc: 'Close open dialogs, dropdown menus, and overlays' },
                  { key: 'Arrow Keys', desc: 'Scroll pages and navigate inside radio groups' },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5"
                  >
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono text-xs font-bold text-slate-900 shadow-2xs shrink-0">
                      {s.key}
                    </span>
                    <span className="text-xs text-slate-600 leading-snug">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link
            href="/screen-reader"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 font-bold text-blue-900 hover:text-blue-700 hover:underline"
          >
            <span>View Full Official Screen Reader Access Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold transition-colors"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
