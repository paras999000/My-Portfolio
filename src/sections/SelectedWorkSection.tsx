import React from 'react';
import { Container } from '../components/Container';
import { SectionHeading } from '../components/SectionHeading';
import { ProjectCard } from '../components/ProjectCard';
import { SecondaryProjectCard } from '../components/SecondaryProjectCard';
import { projectsData } from '../data/projectsData';

export const SelectedWorkSection: React.FC = () => {
  const featuredProjects = projectsData.filter((p) => p.featured);
  const moreProjects = projectsData.filter((p) => !p.featured);

  return (
    <section 
      id="work-section"
      style={{
        position: 'relative',
        paddingTop: 'var(--space-4xl)',
        paddingBottom: 'var(--space-4xl)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <Container>
        {/* ========================================================= */}
        {/* 1. FEATURED SYSTEMS (LARGE CARDS)                         */}
        {/* ========================================================= */}
        <SectionHeading
          number="01 //"
          pretitle="SELECTED SYSTEMS"
          title="FROM CIRCUITS TO COMPLETE SYSTEMS."
          description="Flagship hardware prototypes, embedded firmware pipelines, and real-time intelligence engines designed and manufactured end-to-end."
        />

        <div style={{ marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-4xl)' }}>
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              reversed={index % 2 !== 0}
            />
          ))}
        </div>

        {/* ========================================================= */}
        {/* 2. MORE SYSTEMS (PREMIUM GRID CARDS)                      */}
        {/* ========================================================= */}
        <div id="more-systems" style={{ paddingTop: 'var(--space-2xl)', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-accent)',
                letterSpacing: '0.12em',
                marginBottom: 'var(--space-xs)'
              }}
            >
              <span className="tech-status-dot" />
              <span>MORE SYSTEMS // ENGINEERING INVENTORY</span>
            </div>

            <h2 
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                margin: '0 0 6px 0',
                color: 'var(--text-primary)'
              }}
            >
              MORE SYSTEMS
            </h2>

            <p 
              style={{
                fontSize: '1.02rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
                margin: 0
              }}
            >
              A SELECTION OF OTHER ENGINEERING & SOFTWARE WORK
            </p>
          </div>

          {/* Grid of secondary projects, each with its unique 3D visual */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: 'var(--space-xl)'
            }}
          >
            {moreProjects.map((project, index) => (
              <SecondaryProjectCard
                key={project.id}
                project={project}
                index={featuredProjects.length + index}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
