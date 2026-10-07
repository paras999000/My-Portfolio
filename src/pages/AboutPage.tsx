import React from 'react';
import { Container } from '../components/Container';
import { SectionHeading } from '../components/SectionHeading';
import { AboutSection } from '../sections/AboutSection';
import { CtaSection } from '../sections/CtaSection';

export const AboutPage: React.FC = () => {
  const labEquipment = [
    { category: "MICROCONTROLLERS & SOCs", items: "ESP32-S3, ESP32-WROOM, ESP8266, Raspberry Pi Pico W, RP2040, Arduino Uno/Mega" },
    { category: "DEBUGGING & TELEMETRY", items: "8-Channel USB Logic Analyzer, Digital Storage Oscilloscope, FTDI Serial UART Adapters, JTAG Debuggers" },
    { category: "RAPID FABRICATION", items: "Direct FDM 3D Printing (PLA+, PETG, TPU), ZeroPCB Point-to-Point Prototyping, Temperature-Controlled Soldering & Desoldering" },
    { category: "CAD & SIMULATION SUITE", items: "Autodesk Fusion 360 (Parametric Part Modeling & DFA), Blender (Subterranean Mesh Design), Unity XR & ARCore SDK" },
    { category: "FIRMWARE & SYSTEMS TOOLCHAIN", items: "ESP-IDF, FreeRTOS, CMake, VSCode Embedded Tools, Linux (Ubuntu/Debian CLI), Docker Engine, Git" }
  ];

  return (
    <main style={{ paddingTop: 'calc(var(--header-height) + 2rem)' }}>
      <Container>
        <SectionHeading
          number="LAB // 03"
          pretitle="SYSTEMS DOSSIER"
          title="ABOUT HIMANSHU MAKHE."
          description="Hardware prototyping, low-level firmware engineering, real-time spatial computing, and technical community leadership."
        />
      </Container>

      {/* Core Profile & Leadership Sections */}
      <AboutSection />

      {/* Hardware Laboratory Workstation Inventory */}
      <section 
        style={{
          paddingTop: 'var(--space-4xl)',
          paddingBottom: 'var(--space-4xl)',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <Container>
          <div className="section-pretitle">
            <span className="section-number">INVENTORY //</span>
            <span className="tech-label">LABORATORY BENCH & TOOLING</span>
          </div>
          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 'var(--space-lg)' }}>
            PHYSICAL WORKBENCH & TOOLCHAIN
          </h2>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-lg)'
            }}
          >
            {labEquipment.map((eq, idx) => (
              <div 
                key={idx}
                className="tech-bracket"
                style={{
                  padding: 'var(--space-lg)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-accent)', marginBottom: '8px' }}>
                  // {eq.category}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {eq.items}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Direct Contact */}
      <CtaSection />
    </main>
  );
};
