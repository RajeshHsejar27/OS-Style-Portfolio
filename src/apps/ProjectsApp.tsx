import { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  url: string;
  featured: boolean;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with real-time inventory management, payment processing, and order tracking. Built with React, Node.js, and PostgreSQL.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: 'https://example.com/ecommerce',
    featured: true,
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative task management application with real-time updates, team workspaces, and advanced filtering. Features drag-and-drop interface and deadline tracking.',
    tags: ['React', 'TypeScript', 'Firebase', 'Tailwind'],
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: 'https://example.com/taskmanager',
    featured: true,
  },
  {
    id: '3',
    title: 'Analytics Dashboard',
    description: 'Real-time analytics dashboard with interactive charts, data visualization, and export capabilities. Processes millions of data points efficiently.',
    tags: ['React', 'D3.js', 'WebSocket', 'Express'],
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: 'https://example.com/analytics',
    featured: true,
  },
  {
    id: '4',
    title: 'Social Media App',
    description: 'Modern social networking platform with posts, comments, likes, and real-time notifications. Includes image upload and user profiles.',
    tags: ['React', 'GraphQL', 'MongoDB', 'AWS S3'],
    image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: 'https://example.com/social',
    featured: false,
  },
];

interface BrowserModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

const BrowserModal: React.FC<BrowserModalProps> = ({ url, title, onClose }) => {
  return (
    <div className="browser-modal-overlay" onClick={onClose}>
      <div className="browser-modal" onClick={(e) => e.stopPropagation()}>
        <div className="browser-header">
          <div className="browser-controls">
            <span className="browser-dot" />
            <span className="browser-dot" />
            <span className="browser-dot" />
          </div>
          <div className="browser-url">{url}</div>
          <button
            className="browser-close"
            onClick={onClose}
            aria-label="Close browser"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        <div className="browser-content">
          <iframe
            src={url}
            title={title}
            sandbox="allow-same-origin allow-scripts allow-forms"
            className="browser-iframe"
          />
        </div>
      </div>
    </div>
  );
};

const ProjectsApp: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="app-projects">
      <div className="projects-header">
        <h2>Featured Projects</h2>
        <p>A selection of my recent work</p>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-image">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
              />
              {project.featured && (
                <span className="project-badge">Featured</span>
              )}
            </div>
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map(tag => (
                  <span key={tag} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <button
                className="project-link"
                onClick={() => setSelectedProject(project)}
                type="button"
              >
                <ExternalLink size={16} />
                View Project
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <BrowserModal
          url={selectedProject.url}
          title={selectedProject.title}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectsApp;
