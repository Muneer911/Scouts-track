'use client';

import { Navigation } from './components/layout/Navigation';
import { Hero } from './components/landing/Hero';
import { ProblemSolution } from './components/ProblemSolution';
import { Features } from './components/landing/Features';
import { HowItWorks } from './components/landing/HowItWorks';
import { Trust } from './components/landing/Trust';
import { FinalCTA } from './components/landing/FinalCTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <ProblemSolution />
      <div id="features">
        <Features />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <Trust />
      <div id="contact">
        <FinalCTA />
      </div>
    </main>
  );
}
