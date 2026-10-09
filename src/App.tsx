/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { SmoothScrollProvider } from './components/SmoothScrollProvider';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { LoadingScreen } from './components/LoadingScreen';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AiAssistantDock } from './components/ai/AiAssistantDock';
import { Footer } from './components/Footer';

import { HomeSection } from './sections/HomeSection';

const StarfieldCanvas = lazy(() =>
  import('./three/StarfieldCanvas').then((m) => ({ default: m.StarfieldCanvas }))
);
const AboutSection = lazy(() =>
  import('./sections/AboutSection').then((m) => ({ default: m.AboutSection }))
);
const ServicesSection = lazy(() =>
  import('./sections/ServicesSection').then((m) => ({ default: m.ServicesSection }))
);
const FounderSection = lazy(() =>
  import('./sections/FounderSection').then((m) => ({ default: m.FounderSection }))
);
const ProjectsSection = lazy(() =>
  import('./sections/ProjectsSection').then((m) => ({ default: m.ProjectsSection }))
);
const AiSection = lazy(() =>
  import('./sections/AiSection').then((m) => ({ default: m.AiSection }))
);
const ProcessSpecialtyFaqSection = lazy(() =>
  import('./sections/ProcessSpecialtyFaqSection').then((m) => ({
    default: m.ProcessSpecialtyFaqSection,
  }))
);
const ContactSection = lazy(() =>
  import('./sections/ContactSection').then((m) => ({ default: m.ContactSection }))
);

export default function App() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#050816] text-[#F5F7FF] selection:bg-[#2F6BFF]/30 selection:text-[#F5F7FF]">
        {/* Accessible Skip-to-Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:px-5 focus:py-3 focus:rounded-full focus:bg-[#2F6BFF] focus:text-[#F5F7FF] font-mono-label text-[11px]"
        >
          SKIP TO MAIN CONTENT
        </a>

        {/* Top Scroll Progress Bar in Blue-to-Violet Gradient */}
        <ScrollProgressBar />

        {/* Initial SVG Ring Draw Loading Screen */}
        <LoadingScreen />

        {/* Custom Precision Cursor (Desktop Fine Pointer) */}
        <CustomCursor />

        {/* Global Fixed 3D Starfield & Nebula Background (Code-Split) */}
        <Suspense fallback={<div className="fixed inset-0 bg-[#050816] z-0" aria-hidden="true" />}>
          <StarfieldCanvas />
        </Suspense>

        {/* Floating Pill Glass Navbar */}
        <Navbar />

        {/* Single-Page Anchored Sections */}
        <main id="main-content" className="relative z-10">
          <HomeSection />
          <Suspense fallback={null}>
            <AboutSection />
            <ServicesSection />
            <FounderSection />
            <ProjectsSection />
            <AiSection />
            <ProcessSpecialtyFaqSection />
            <ContactSection />
          </Suspense>
        </main>

        {/* Studio Footer */}
        <Footer />

        {/* Stacked AI Assistant Dock (Voice + Chat above WhatsApp) */}
        <AiAssistantDock />

        {/* Sticky Floating WhatsApp Action */}
        <WhatsAppButton />
      </div>
    </SmoothScrollProvider>
  );
}

