import { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store/useStore';
import { getAllApps } from '../apps/registry';

const BASE_ICON_SIZE = 48;
const MAX_ICON_SIZE = 72;
const INFLUENCE_RANGE = 150;

const calculateMagnification = (distance: number): number => {
  if (distance > INFLUENCE_RANGE) return 1;

  const normalizedDistance = distance / INFLUENCE_RANGE;
  const gaussianCurve = Math.exp(-3 * normalizedDistance * normalizedDistance);

  return 1 + (gaussianCurve * ((MAX_ICON_SIZE - BASE_ICON_SIZE) / BASE_ICON_SIZE));
};

interface DockIconProps {
  appId: string;
  name: string;
  iconName: string;
  scale: number;
  isRunning: boolean;
}

const DockIcon: React.FC<DockIconProps> = ({ appId, name, iconName, scale, isRunning }) => {
  const { openWindow, windows, minimizeWindow } = useStore();
  const IconComponent = (Icons as any)[iconName] || Icons.Folder;

  const handleClick = () => {
    const appWindows = windows.filter(w => w.appId === appId);
    const minimizedWindow = appWindows.find(w => w.minimized);

    if (minimizedWindow) {
      minimizeWindow(minimizedWindow.id);
      return;
    }

    const apps = getAllApps();
    const app = apps.find(a => a.id === appId);
    if (app) {
      openWindow(app.id, app.name, app.defaultWidth, app.defaultHeight);
    }
  };

  const size = BASE_ICON_SIZE * scale;

  return (
    <button
      className="dock-icon"
      onClick={handleClick}
      aria-label={name}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translateY(${-(size - BASE_ICON_SIZE) / 2}px)`,
      }}
      type="button"
    >
      <IconComponent size={size * 0.6} strokeWidth={1.5} />
      {isRunning && <span className="dock-running-indicator" />}
      <span className="dock-tooltip">{name}</span>
    </button>
  );
};

export const Dock: React.FC = () => {
  const dockRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [iconPositions, setIconPositions] = useState<DOMRect[]>([]);
  const { windows } = useStore();

  const apps = getAllApps();

  useEffect(() => {
    const updateIconPositions = () => {
      if (!dockRef.current) return;

      const icons = dockRef.current.querySelectorAll('.dock-icon');
      const positions: DOMRect[] = [];

      icons.forEach(icon => {
        positions.push(icon.getBoundingClientRect());
      });

      setIconPositions(positions);
    };

    updateIconPositions();
    window.addEventListener('resize', updateIconPositions);

    return () => window.removeEventListener('resize', updateIconPositions);
  }, [apps.length]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
  };

  const calculateIconScale = (index: number): number => {
    if (!mousePosition || iconPositions.length === 0) return 1;

    const iconRect = iconPositions[index];
    if (!iconRect) return 1;

    const iconCenterX = iconRect.left + iconRect.width / 2;
    const iconCenterY = iconRect.top + iconRect.height / 2;

    const distance = Math.sqrt(
      Math.pow(mousePosition.x - iconCenterX, 2) +
      Math.pow(mousePosition.y - iconCenterY, 2)
    );

    return calculateMagnification(distance);
  };

  return (
    <div
      ref={dockRef}
      className="dock"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="toolbar"
      aria-label="Application dock"
    >
      <div className="dock-container">
        {apps.map((app, index) => {
          const isRunning = windows.some(w => w.appId === app.id && !w.minimized);
          const scale = calculateIconScale(index);

          return (
            <DockIcon
              key={app.id}
              appId={app.id}
              name={app.name}
              iconName={app.icon}
              scale={scale}
              isRunning={isRunning}
            />
          );
        })}
      </div>
    </div>
  );
};
