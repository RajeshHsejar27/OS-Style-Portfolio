import { create } from 'zustand';
import { WindowState, DragState, ResizeState } from '../types';

interface OSState {
  windows: WindowState[];
  dragState: DragState;
  resizeState: ResizeState;
  startMenuOpen: boolean;
  nextZIndex: number;

  openWindow: (appId: string, title: string, defaultWidth: number, defaultHeight: number) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, x: number, y: number) => void;
  updateWindowSize: (windowId: string, width: number, height: number) => void;
  setDragState: (state: Partial<DragState>) => void;
  setResizeState: (state: Partial<ResizeState>) => void;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
}

const WINDOW_MIN_WIDTH = 300;
const WINDOW_MIN_HEIGHT = 200;

export const useStore = create<OSState>((set, get) => ({
  windows: [],
  dragState: {
    isDragging: false,
    windowId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  },
  resizeState: {
    isResizing: false,
    windowId: null,
    direction: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startWindowX: 0,
    startWindowY: 0,
  },
  startMenuOpen: false,
  nextZIndex: 1000,

  openWindow: (appId, title, defaultWidth, defaultHeight) => {
    const existingWindow = get().windows.find(w => w.appId === appId && !w.minimized);

    if (existingWindow) {
      get().focusWindow(existingWindow.id);
      return;
    }

    const minimizedWindow = get().windows.find(w => w.appId === appId && w.minimized);

    if (minimizedWindow) {
      set(state => ({
        windows: state.windows.map(w =>
          w.id === minimizedWindow.id
            ? { ...w, minimized: false, focused: true, zIndex: state.nextZIndex }
            : { ...w, focused: false }
        ),
        nextZIndex: state.nextZIndex + 1,
      }));
      return;
    }

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      title,
      x: 100 + (get().windows.length * 30),
      y: 80 + (get().windows.length * 30),
      width: defaultWidth,
      height: defaultHeight,
      minimized: false,
      maximized: false,
      focused: true,
      zIndex: get().nextZIndex,
    };

    set(state => ({
      windows: [
        ...state.windows.map(w => ({ ...w, focused: false })),
        newWindow,
      ],
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  closeWindow: (windowId) => {
    set(state => ({
      windows: state.windows.filter(w => w.id !== windowId),
    }));
  },

  minimizeWindow: (windowId) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, minimized: true, focused: false } : w
      ),
    }));
  },

  maximizeWindow: (windowId) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, maximized: !w.maximized } : w
      ),
    }));
  },

  focusWindow: (windowId) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId
          ? { ...w, focused: true, zIndex: state.nextZIndex }
          : { ...w, focused: false }
      ),
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  updateWindowPosition: (windowId, x, y) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, x, y } : w
      ),
    }));
  },

  updateWindowSize: (windowId, width, height) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId
          ? {
              ...w,
              width: Math.max(width, WINDOW_MIN_WIDTH),
              height: Math.max(height, WINDOW_MIN_HEIGHT),
            }
          : w
      ),
    }));
  },

  setDragState: (newState) => {
    set(state => ({
      dragState: { ...state.dragState, ...newState },
    }));
  },

  setResizeState: (newState) => {
    set(state => ({
      resizeState: { ...state.resizeState, ...newState },
    }));
  },

  toggleStartMenu: () => {
    set(state => ({
      startMenuOpen: !state.startMenuOpen,
    }));
  },

  closeStartMenu: () => {
    set({ startMenuOpen: false });
  },
}));
