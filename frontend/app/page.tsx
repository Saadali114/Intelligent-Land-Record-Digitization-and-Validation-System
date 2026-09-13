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
  ContactSection,
  LandingFooter,
} from '../components/landing';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f8f4] flex flex-col selection:bg-emerald-200 selection:text-emerald-950">
      {/* 1. Main Top Gov Ribbon */}
      <MainNavbar />

      {/* 2. Subnavbar Brand & CTAs */}
      <SubNavbar />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* 3. Hero Section: Cadastral Vault & Record Protection */}
        <HeroSlider />

        {/* 4. Rescuing Historical Parchments with Cadastral AI */}
        <AboutUsSection />

        {/* 5. The Unified 8-Layer Cadastral Land Stack */}
        <LandStackSection />

        {/* 6. Certified Cadastral Services & Records */}
        <ServicesSection />
      </main>

      {/* 7. Official Maharashtra Government Footer */}
      <LandingFooter />
    </div>
  );
}
