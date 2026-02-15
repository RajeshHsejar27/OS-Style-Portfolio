import { useEffect, useRef, Suspense } from 'react';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { WindowState, ResizeDirection } from '../types';
import { getAppById } from '../apps/registry';

interface WindowProps {
  window: WindowState;
}

const RESIZE_HANDLE_SIZE = 8;

export const Window: React.FC<WindowProps> = ({ window }) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    setDragState,
    setResizeState,
    dragState,
    resizeState,
  } = useStore();

  const app = getAppById(window.appId);

  if (!app) return null;

  const handleMouseDownTitle = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button')) return;

    e.preventDefault();
    focusWindow(window.id);

    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragState({
      isDragging: true,
      windowId: window.id,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
  };

  const handleMouseDownResize = (direction: ResizeDirection) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(window.id);

    setResizeState({
      isResizing: true,
      windowId: window.id,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: window.width,
      startHeight: window.height,
      startWindowX: window.x,
      startWindowY: window.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging && dragState.windowId === window.id) {
        const newX = e.clientX - dragState.offsetX;
        const newY = e.clientY - dragState.offsetY;
        updateWindowPosition(window.id, newX, newY);
      }

      if (resizeState.isResizing && resizeState.windowId === window.id) {
        const deltaX = e.clientX - resizeState.startX;
        const deltaY = e.clientY - resizeState.startY;

        let newWidth = resizeState.startWidth;
        let newHeight = resizeState.startHeight;
        let newX = resizeState.startWindowX;
        let newY = resizeState.startWindowY;

        const dir = resizeState.direction;

        if (dir?.includes('e')) {
          newWidth = resizeState.startWidth + deltaX;
        }
        if (dir?.includes('w')) {
          newWidth = resizeState.startWidth - deltaX;
          newX = resizeState.startWindowX + deltaX;
        }
        if (dir?.includes('s')) {
          newHeight = resizeState.startHeight + deltaY;
        }
        if (dir?.includes('n')) {
          newHeight = resizeState.startHeight - deltaY;
          newY = resizeState.startWindowY + deltaY;
        }

        if (newWidth !== resizeState.startWidth || newHeight !== resizeState.startHeight) {
          updateWindowSize(window.id, newWidth, newHeight);
        }
        if (newX !== resizeState.startWindowX || newY !== resizeState.startWindowY) {
          updateWindowPosition(window.id, newX, newY);
        }
      }
    };

    const handleMouseUp = () => {
      if (dragState.windowId === window.id) {
        setDragState({ isDragging: false, windowId: null });
      }
      if (resizeState.windowId === window.id) {
        setResizeState({ isResizing: false, windowId: null, direction: null });
      }
    };

    if (dragState.isDragging || resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, resizeState, window.id, updateWindowPosition, updateWindowSize, setDragState, setResizeState]);

  const AppComponent = app.component;

  const style: React.CSSProperties = {
    transform: `translate(${window.x}px, ${window.y}px)`,
    width: window.maximized ? '100%' : `${window.width}px`,
    height: window.maximized ? 'calc(100% - 60px)' : `${window.height}px`,
    zIndex: window.zIndex,
    top: window.maximized ? 0 : undefined,
    left: window.maximized ? 0 : undefined,
  };

  if (window.minimized) return null;

  return (
    <div
      ref={windowRef}
      className={`window ${window.focused ? 'focused' : ''}`}
      style={style}
      onMouseDown={() => focusWindow(window.id)}
      role="dialog"
      aria-label={window.title}
      aria-modal="false"
    >
      <div className="window-titlebar" onMouseDown={handleMouseDownTitle}>
        <span className="window-title">{window.title}</span>
        <div className="window-controls">
          <button
            className="window-button minimize"
            onClick={() => minimizeWindow(window.id)}
            aria-label="Minimize"
            type="button"
          >
            <Minus size={14} />
          </button>
          <button
            className="window-button maximize"
            onClick={() => maximizeWindow(window.id)}
            aria-label={window.maximized ? 'Restore' : 'Maximize'}
            type="button"
          >
            {window.maximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            className="window-button close"
            onClick={() => closeWindow(window.id)}
            aria-label="Close"
            type="button"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="window-content">
        <Suspense fallback={<div className="window-loading">Loading...</div>}>
          <AppComponent />
        </Suspense>
      </div>

      {!window.maximized && (
        <>
          <div
            className="resize-handle resize-n"
            onMouseDown={handleMouseDownResize('n')}
            style={{ top: 0, left: RESIZE_HANDLE_SIZE, right: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE }}
          />
          <div
            className="resize-handle resize-s"
            onMouseDown={handleMouseDownResize('s')}
            style={{ bottom: 0, left: RESIZE_HANDLE_SIZE, right: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE }}
          />
          <div
            className="resize-handle resize-e"
            onMouseDown={handleMouseDownResize('e')}
            style={{ top: RESIZE_HANDLE_SIZE, right: 0, bottom: RESIZE_HANDLE_SIZE, width: RESIZE_HANDLE_SIZE }}
          />
          <div
            className="resize-handle resize-w"
            onMouseDown={handleMouseDownResize('w')}
            style={{ top: RESIZE_HANDLE_SIZE, left: 0, bottom: RESIZE_HANDLE_SIZE, width: RESIZE_HANDLE_SIZE }}
          />
          <div
            className="resize-handle resize-ne"
            onMouseDown={handleMouseDownResize('ne')}
            style={{ top: 0, right: 0, width: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE }}
          />
          <div
            className="resize-handle resize-nw"
            onMouseDown={handleMouseDownResize('nw')}
            style={{ top: 0, left: 0, width: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE }}
          />
          <div
            className="resize-handle resize-se"
            onMouseDown={handleMouseDownResize('se')}
            style={{ bottom: 0, right: 0, width: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE }}
          />
          <div
            className="resize-handle resize-sw"
            onMouseDown={handleMouseDownResize('sw')}
            style={{ bottom: 0, left: 0, width: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE }}
          />
        </>
      )}
    </div>
  );
};
