import { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  startDate: string;
  endDate: string | null;
  location: string;
  highlights: string[];
}

const experiences: Experience[] = [
  {
    id: '1',
    company: 'Tech Innovations Inc.',
    role: 'Senior Frontend Developer',
    duration: '2021 - Present',
    startDate: '2021-03',
    endDate: null,
    location: 'San Francisco, CA',
    highlights: [
      'Led development of a React-based design system used across 20+ products',
      'Improved application performance by 40% through code splitting and lazy loading',
      'Mentored 5 junior developers and conducted code reviews',
      'Implemented CI/CD pipeline reducing deployment time by 60%',
    ],
  },
  {
    id: '2',
    company: 'Digital Solutions Co.',
    role: 'Frontend Developer',
    duration: '2019 - 2021',
    startDate: '2019-06',
    endDate: '2021-02',
    location: 'New York, NY',
    highlights: [
      'Built responsive web applications using React and TypeScript',
      'Collaborated with UX designers to implement pixel-perfect designs',
      'Reduced bundle size by 35% through optimization techniques',
      'Implemented accessibility features achieving WCAG 2.1 AA compliance',
    ],
  },
  {
    id: '3',
    company: 'StartUp Ventures',
    role: 'Junior Frontend Developer',
    duration: '2018 - 2019',
    startDate: '2018-01',
    endDate: '2019-05',
    location: 'Austin, TX',
    highlights: [
      'Developed user interfaces for web applications using React',
      'Worked in an Agile environment with 2-week sprints',
      'Integrated RESTful APIs and handled state management',
      'Participated in daily standups and sprint planning meetings',
    ],
  },
];

const ExperienceApp: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(experiences[0]?.id || '');

  const selectedExperience = experiences.find(exp => exp.id === selectedId);

  return (
    <div className="app-experience">
      <div className="experience-sidebar">
        <h3>Career Timeline</h3>
        <div className="experience-list">
          {experiences.map(exp => (
            <button
              key={exp.id}
              className={`experience-item ${selectedId === exp.id ? 'active' : ''}`}
              onClick={() => setSelectedId(exp.id)}
              type="button"
            >
              <div className="experience-item-role">{exp.role}</div>
              <div className="experience-item-company">{exp.company}</div>
              <div className="experience-item-duration">{exp.duration}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="experience-content">
        {selectedExperience && (
          <>
            <div className="experience-header">
              <h2>{selectedExperience.role}</h2>
              <h3>{selectedExperience.company}</h3>
              <div className="experience-meta">
                <span className="experience-meta-item">
                  <Calendar size={16} />
                  {selectedExperience.duration}
                </span>
                <span className="experience-meta-item">
                  <MapPin size={16} />
                  {selectedExperience.location}
                </span>
              </div>
            </div>

            <div className="experience-highlights">
              <h4>Key Achievements</h4>
              <ul>
                {selectedExperience.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExperienceApp;
