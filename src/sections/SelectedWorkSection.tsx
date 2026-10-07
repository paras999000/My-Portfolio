import React from 'react';
import { Container } from '../components/Container';
import { SectionHeading } from '../components/SectionHeading';
import { ProjectCard } from '../components/ProjectCard';
import { projectsData } from '../data/projectsData';

export const SelectedWorkSection: React.FC = () => {
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
        <SectionHeading
          number="01 //"
          pretitle="SYSTEMS I BUILT"
          title="FROM CIRCUITS TO COMPLETE SYSTEMS."
          description="Hardware prototypes, embedded firmware pipelines, and real-time intelligence engines designed and manufactured end-to-end."
        />

        <div style={{ marginTop: 'var(--space-2xl)' }}>
          {projectsData.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              reversed={index % 2 !== 0}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};
