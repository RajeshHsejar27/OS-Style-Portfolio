export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  focused: boolean;
  zIndex: number;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  component: React.LazyExoticComponent<React.ComponentType>;
}

export interface DesktopIcon {
  id: string;
  appId: string;
  name: string;
  icon: string;
  x: number;
  y: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  startDate: string;
  endDate: string | null;
  highlights: string[];
  logo?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  url: string;
  featured: boolean;
}

export interface DockItem {
  id: string;
  appId: string;
  name: string;
  icon: string;
  running: boolean;
  minimized: boolean;
}

export type DragState = {
  isDragging: boolean;
  windowId: string | null;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
};

export type ResizeState = {
  isResizing: boolean;
  windowId: string | null;
  direction: ResizeDirection | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startWindowX: number;
  startWindowY: number;
};

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
