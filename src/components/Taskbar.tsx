import { Menu } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Taskbar: React.FC = () => {
  const { toggleStartMenu, startMenuOpen } = useStore();

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="taskbar" role="navigation" aria-label="Taskbar">
      <button
        className={`start-button ${startMenuOpen ? 'active' : ''}`}
        onClick={toggleStartMenu}
        aria-label="Start menu"
        aria-expanded={startMenuOpen}
        type="button"
      >
        <Menu size={20} />
      </button>

      <div className="taskbar-center">
        <span className="taskbar-title">Portfolio OS</span>
      </div>

      <div className="taskbar-tray">
        <div className="taskbar-clock">
          <div className="taskbar-time">{currentTime}</div>
          <div className="taskbar-date">{currentDate}</div>
        </div>
      </div>
    </div>
  );
};
