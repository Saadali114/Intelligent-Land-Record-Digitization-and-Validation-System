'use client';

import React from 'react';
import {
  MainNavbar,
  SubNavbar,
  HeroSlider,
  AboutUsSection,
  ServicesSection,
  NewsNoticesSection,
  FaqSection,
  ContactSection,
  LandingFooter,
} from '../components/landing';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* 1. Main Top Navbar (Districts, RTI, RTS, EODB, Dashboard) */}
      <MainNavbar />

      {/* 2. Subnavbar (ILRDVS brand, Home, About, Services, Resources, Schemes & Projects, Citizen Corner, More, [Employee Login]) */}
      <SubNavbar />

      {/* 3. Hero Section (Attractive slider: "Your land records are safe here", Land info slides, News & Services highlights) */}
      <HeroSlider />

      {/* 4. About Us Section (Cadastral Heritage, Modernization mission, 4 AI Pillars) */}
      <AboutUsSection />

      {/* 6. Land Related Services Section (6 core citizen services with direct access links) */}
      <ServicesSection />

      {/* 5. News & Notices Section (Official Gazettes, Circulars, Orders with filter tabs) */}
      <NewsNoticesSection />

      {/* 7. FAQs Section (Interactive accordion with common citizen questions) */}
      <FaqSection />

      {/* 8. Contact Us Section (Grievance submission & Revenue Directorate directory) */}
      <ContactSection />

      {/* 9. Official Government Footer */}
      <LandingFooter />
    </div>
  );
}
