import React, { useState } from 'react';
import { Container } from '../components/Container';
import { SectionHeading } from '../components/SectionHeading';
import { ProjectCard } from '../components/ProjectCard';
import { SecondaryProjectCard } from '../components/SecondaryProjectCard';
import { projectsData } from '../data/projectsData';

export const WorkPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');

  const categories = [
    'ALL',
    'EMBEDDED & HARDWARE',
    'IoT',
    'AI / ML',
    'CYBERSECURITY',
    'AR / 3D',
    'ROBOTICS',
    'SYSTEMS & DEVOPS'
  ];

  const filteredProjects = projectsData.filter((p) => {
    if (filter === 'ALL') return true;
    const cat = p.category.toUpperCase();
    const techs = p.technologies.map(t => t.toUpperCase()).join(' ');

    if (filter === 'EMBEDDED & HARDWARE') {
      return cat.includes('EMBEDDED') || cat.includes('HARDWARE') || techs.includes('ESP32') || techs.includes('PICO');
    }
    if (filter === 'IoT') {
      return cat.includes('IOT') || techs.includes('THINGSPEAK') || techs.includes('SUPABASE') || techs.includes('SENSOR');
    }
    if (filter === 'AI / ML') {
      return cat.includes('AI') || cat.includes('ML') || cat.includes('ALGORITHMS') || techs.includes('GEMINI') || techs.includes('A*');
    }
    if (filter === 'CYBERSECURITY') {
      return cat.includes('CYBERSECURITY') || cat.includes('DFIR') || techs.includes('SHA-256') || techs.includes('WORM');
    }
    if (filter === 'AR / 3D') {
      return cat.includes('AR') || cat.includes('3D') || techs.includes('UNITY') || techs.includes('ARCORE');
    }
    if (filter === 'ROBOTICS') {
      return cat.includes('ROBOTICS') || techs.includes('SERVOS') || techs.includes('KINEMATICS');
    }
    if (filter === 'SYSTEMS & DEVOPS') {
      return cat.includes('SYSTEMS') || cat.includes('DEVOPS') || techs.includes('DOCKER') || techs.includes('POSTGRESQL');
    }
    return true;
  });

  return (
    <main style={{ paddingTop: 'calc(var(--header-height) + 3rem)', paddingBottom: 'var(--space-4xl)' }}>
      <Container>
        <SectionHeading
          number="CATALOG // 01"
          pretitle="SYSTEMS ENGINEERING"
          title="SELECTED HARDWARE & SOFTWARE WORK."
          description="Explore physical computing prototypes, embedded firmware architectures, real-time kinematics, cryptographic forensics, and spatial simulation engines."
        />

        {/* Filter Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-2xl)',
            padding: '12px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '3px'
          }}
        >
          <span className="tech-coord" style={{ marginRight: '6px' }}>FILTER DISCIPLINE:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="tech-badge"
              style={{
                cursor: 'pointer',
                backgroundColor: filter === cat ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                borderColor: filter === cat ? 'var(--border-accent-strong)' : 'var(--border-subtle)',
                color: filter === cat ? 'var(--text-accent)' : 'var(--text-secondary)'
              }}
            >
              {cat}
            </button>
          ))}

          <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            SHOWING {filteredProjects.length} OF {projectsData.length} SYSTEMS
          </div>
        </div>

        {/* Projects Grid / List */}
        {filter === 'ALL' ? (
          <div>
            {/* Top 4 Featured Systems */}
            <div style={{ marginBottom: 'var(--space-3xl)' }}>
              {filteredProjects.slice(0, 4).map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  reversed={index % 2 !== 0}
                />
              ))}
            </div>

            {/* Remaining Systems Grid */}
            <div style={{ paddingTop: 'var(--space-xl)', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-accent)', letterSpacing: '0.1em' }}>
                  MORE SYSTEMS // ENGINEERING INVENTORY
                </h3>
              </div>
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: 'var(--space-xl)'
                }}
              >
                {filteredProjects.slice(4).map((project, index) => (
                  <SecondaryProjectCard
                    key={project.id}
                    project={project}
                    index={4 + index}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: 'var(--space-xl)'
            }}
          >
            {filteredProjects.map((project, index) => (
              <SecondaryProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
};
