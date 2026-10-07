import React, { useState } from 'react';
import { Container } from '../components/Container';
import { SectionHeading } from '../components/SectionHeading';
import { ProjectCard } from '../components/ProjectCard';
import { projectsData } from '../data/projectsData';

export const WorkPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');

  const categories = ['ALL', 'EMBEDDED AI', 'AR SIMULATION', 'ROBOTICS', 'IoT'];

  const filteredProjects = projectsData.filter((p) => {
    if (filter === 'ALL') return true;
    if (filter === 'EMBEDDED AI') return p.category.includes('EMBEDDED AI');
    if (filter === 'AR SIMULATION') return p.category.includes('SIMULATION') || p.category.includes('AR');
    if (filter === 'ROBOTICS') return p.category.includes('ROBOTICS');
    if (filter === 'IoT') return p.category.includes('THINGS') || p.category.includes('IoT');
    return true;
  });

  return (
    <main style={{ paddingTop: 'calc(var(--header-height) + 3rem)', paddingBottom: 'var(--space-4xl)' }}>
      <Container>
        <SectionHeading
          number="CATALOG // 01"
          pretitle="SYSTEMS ENGINEERING"
          title="SELECTED HARDWARE & SOFTWARE WORK."
          description="Explore physical computing prototypes, embedded firmware architectures, real-time kinematics, and spatial simulation engines."
        />

        {/* Filter Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
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

        {/* Projects List */}
        <div>
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              reversed={index % 2 !== 0}
            />
          ))}
        </div>
      </Container>
    </main>
  );
};
