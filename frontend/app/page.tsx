'use client';

import React from 'react';
import {
  MainNavbar,
  SubNavbar,
  HeroSlider,
  AboutUsSection,
  LandStackSection,
  ServicesSection,
  FaqSection,
  QuickAccessBar,
  ContactSection,
  LandingFooter,
} from '../components/landing';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* 1. Main Top Navbar (Districts, RTI, RTS, EODB, Dashboard) */}
      <MainNavbar />

      {/* 2. Subnavbar (ILRDVS brand, Home, About, Services, Resources, Schemes & Projects, Citizen Corner, [Officer Login]) */}
      <SubNavbar />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* 3. Hero Section (Attractive slider: "Your land records are safe here", Land info slides, DILRMP 3.0 highlights) */}
        <HeroSlider />

        {/* 3.1 Quick Access & Direct Inspection Bar (Survey Number, Mutation History, GIS Cadastral Map) */}
        <QuickAccessBar />

        {/* 4. About Us Section (Cadastral Heritage, Modernization mission, 4 AI Pillars) */}
        <AboutUsSection />

        {/* 5. The Unified 8-Layer Land Stack (DILRMP 3.0 Operational Guidelines 2026-2031) */}
        <LandStackSection />

        {/* 6. Land Related Services Section (Core citizen services with direct access links) */}
        <ServicesSection />

        {/* 7. FAQs Section (Interactive accordion with common citizen questions) */}
        <FaqSection />

        {/* 8. Contact Us Section (Grievance submission & Revenue Directorate directory) */}
        <ContactSection />
      </main>

      {/* 9. Official Government Footer */}
      <LandingFooter />
    </div>
  );
}
