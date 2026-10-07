import React from 'react';
import { HeroSection } from '../sections/HeroSection';
import { SelectedWorkSection } from '../sections/SelectedWorkSection';
import { ThreeDLabSection } from '../sections/ThreeDLabSection';
import { DisciplinesSection } from '../sections/DisciplinesSection';
import { AboutSection } from '../sections/AboutSection';
import { CtaSection } from '../sections/CtaSection';

export const HomePage: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <SelectedWorkSection />
      <ThreeDLabSection />
      <DisciplinesSection />
      <AboutSection />
      <CtaSection />
    </main>
  );
};
