import { useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store/useStore';
import { getAllApps } from '../apps/registry';

export const StartMenu: React.FC = () => {
  const { startMenuOpen, closeStartMenu, openWindow } = useStore();
  const menuRef = useRef<HTMLDivElement>(null);

  const apps = getAllApps();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const startButton = document.querySelector('.start-button');
        if (startButton && !startButton.contains(event.target as Node)) {
          closeStartMenu();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && startMenuOpen) {
        closeStartMenu();
      }
    };

    if (startMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [startMenuOpen, closeStartMenu]);

  const handleAppClick = (appId: string, name: string, defaultWidth: number, defaultHeight: number) => {
    openWindow(appId, name, defaultWidth, defaultHeight);
    closeStartMenu();
  };

  if (!startMenuOpen) return null;

  return (
    <div
      ref={menuRef}
      className="start-menu"
      role="menu"
      aria-label="Start menu"
    >
      <div className="start-menu-header">
        <h2>Applications</h2>
      </div>
      <div className="start-menu-apps">
        {apps.map((app) => {
          const IconComponent = (Icons as any)[app.icon] || Icons.Folder;

          return (
            <button
              key={app.id}
              className="start-menu-item"
              onClick={() => handleAppClick(app.id, app.name, app.defaultWidth, app.defaultHeight)}
              role="menuitem"
              type="button"
            >
              <IconComponent size={24} strokeWidth={1.5} />
              <span>{app.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
