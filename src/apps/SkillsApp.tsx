interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

const skills: Skill[] = [
  { id: '1', name: 'React', category: 'Frontend', level: 95 },
  { id: '2', name: 'TypeScript', category: 'Frontend', level: 90 },
  { id: '3', name: 'JavaScript', category: 'Frontend', level: 95 },
  { id: '4', name: 'HTML/CSS', category: 'Frontend', level: 95 },
  { id: '5', name: 'Tailwind CSS', category: 'Frontend', level: 85 },
  { id: '6', name: 'Vue.js', category: 'Frontend', level: 75 },

  { id: '7', name: 'Node.js', category: 'Backend', level: 80 },
  { id: '8', name: 'Express', category: 'Backend', level: 80 },
  { id: '9', name: 'PostgreSQL', category: 'Backend', level: 75 },
  { id: '10', name: 'MongoDB', category: 'Backend', level: 70 },
  { id: '11', name: 'REST APIs', category: 'Backend', level: 85 },
  { id: '12', name: 'GraphQL', category: 'Backend', level: 70 },

  { id: '13', name: 'Git', category: 'Tools', level: 90 },
  { id: '14', name: 'Webpack', category: 'Tools', level: 75 },
  { id: '15', name: 'Vite', category: 'Tools', level: 85 },
  { id: '16', name: 'Docker', category: 'Tools', level: 65 },
  { id: '17', name: 'Jest', category: 'Tools', level: 80 },
  { id: '18', name: 'Figma', category: 'Tools', level: 70 },
];

const categories = ['Frontend', 'Backend', 'Tools'];

const SkillsApp: React.FC = () => {
  return (
    <div className="app-skills">
      <div className="skills-header">
        <h2>Technical Skills</h2>
        <p>Proficiency across the full stack</p>
      </div>

      {categories.map(category => {
        const categorySkills = skills.filter(skill => skill.category === category);

        return (
          <div key={category} className="skills-category">
            <h3>{category}</h3>
            <div className="skills-grid">
              {categorySkills.map(skill => (
                <div key={skill.id} className="skill-item">
                  <div className="skill-header">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-level">{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div
                      className="skill-bar-fill"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SkillsApp;
