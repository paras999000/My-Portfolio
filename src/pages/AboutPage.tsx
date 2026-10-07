import React from 'react';
import { AboutSection } from '../sections/AboutSection';
import { CtaSection } from '../sections/CtaSection';

export const AboutPage: React.FC = () => {
  return (
    <main style={{ paddingTop: 'calc(var(--header-height) + 1.5rem)' }}>
      {/* Core Profile & Leadership Sections */}
      <AboutSection isPage={true} />

      {/* Direct Contact */}
      <CtaSection />
    </main>
  );
};
