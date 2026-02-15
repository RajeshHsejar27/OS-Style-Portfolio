import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store/useStore';
import { getAllApps } from '../apps/registry';

interface DesktopIconProps {
  appId: string;
  name: string;
  iconName: string;
  x: number;
  y: number;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ appId, name, iconName, x, y }) => {
  const { openWindow } = useStore();
  const [lastClick, setLastClick] = useState(0);
  const IconComponent = (Icons as any)[iconName] || Icons.Folder;

  const handleClick = () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClick;

    if (timeSinceLastClick < 400) {
      const apps = getAllApps();
      const app = apps.find(a => a.id === appId);
      if (app) {
        openWindow(app.id, app.name, app.defaultWidth, app.defaultHeight);
      }
    }

    setLastClick(now);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const apps = getAllApps();
      const app = apps.find(a => a.id === appId);
      if (app) {
        openWindow(app.id, app.name, app.defaultWidth, app.defaultHeight);
      }
    }
  };

  return (
    <button
      className="desktop-icon"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ left: `${x}px`, top: `${y}px` }}
      aria-label={`Open ${name}`}
      type="button"
    >
      <div className="desktop-icon-image">
        <IconComponent size={48} strokeWidth={1.5} />
      </div>
      <span className="desktop-icon-label">{name}</span>
    </button>
  );
};

export const Desktop: React.FC = () => {
  const apps = getAllApps();
  const { closeStartMenu } = useStore();

  const iconPositions = [
    { x: 20, y: 20 },
    { x: 20, y: 120 },
    { x: 20, y: 220 },
    { x: 20, y: 320 },
  ];

  return (
    <div
      className="desktop"
      onClick={closeStartMenu}
      role="main"
      aria-label="Desktop"
    >
      {apps.map((app, index) => (
        <DesktopIcon
          key={app.id}
          appId={app.id}
          name={app.name}
          iconName={app.icon}
          x={iconPositions[index]?.x || 20}
          y={iconPositions[index]?.y || 20 + index * 100}
        />
      ))}
    </div>
  );
};
