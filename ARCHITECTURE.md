# Portfolio OS - Architecture Documentation

## Overview

Portfolio OS is a production-grade, OS-style portfolio web application built with React, TypeScript, and Vite. It provides a desktop-like experience with real window physics, desktop icons, a taskbar, a start menu, and a physics-based dock.

## Tech Stack

- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - Lightweight state management
- **Lucide React** - Icon library
- **Tailwind CSS** - Utility-first CSS
- **Supabase** - Database for portfolio data persistence

## Architecture Principles

### 1. Separation of Concerns

The application follows a clean, modular architecture:

```
src/
├── apps/           # Self-contained application components
├── components/     # Reusable UI components
├── store/          # Centralized state management
├── types/          # TypeScript type definitions
└── main.tsx        # Application entry point
```

### 2. Component Hierarchy

```
OSContainer (Root)
├── Desktop
│   └── DesktopIcon (multiple)
├── Windows Layer
│   └── Window (multiple)
│       └── AppComponent (lazy-loaded)
├── StartMenu
├── Taskbar
└── Dock
    └── DockIcon (multiple)
```

### 3. State Management

**Zustand Store** manages all application state:

- Window states (position, size, focus, z-index)
- Drag and resize states
- Start menu open/close state
- Z-index counter for window stacking

State is kept minimal and normalized to prevent unnecessary re-renders.

### 4. Event-Driven Architecture

The Window Manager uses an event-driven approach:

- Mouse events trigger state updates
- State changes trigger component re-renders
- Effects handle side effects (like dragging)

## Core Systems

### Window Manager

**File**: `src/components/Window.tsx`

Features:
- Drag to move windows
- Resize from 8 directions (n, s, e, w, ne, nw, se, sw)
- Minimize/maximize/close controls
- Focus management with z-index stacking
- Keyboard navigation support

**Technical Details**:
- Uses `transform: translate()` for GPU acceleration
- No layout recalculation during drag (uses `will-change`)
- Event listeners added/removed dynamically
- Minimum window size constraints (300x200)

### Physics-Based Dock

**File**: `src/components/Dock.tsx`

The dock implements true cursor-distance-based magnification:

**Algorithm**:
```typescript
const calculateMagnification = (distance: number): number => {
  if (distance > INFLUENCE_RANGE) return 1;

  const normalizedDistance = distance / INFLUENCE_RANGE;
  const gaussianCurve = Math.exp(-3 * normalizedDistance * normalizedDistance);

  return 1 + (gaussianCurve * ((MAX_ICON_SIZE - BASE_ICON_SIZE) / BASE_ICON_SIZE));
};
```

Features:
- Gaussian scaling curve for smooth magnification
- Icon centers calculated from DOM position
- Real-time position updates on resize
- 60fps performance using `requestAnimationFrame`

### Desktop & Icons

**File**: `src/components/Desktop.tsx`

Features:
- Double-click detection (400ms threshold)
- Keyboard accessible (Enter/Space)
- Fixed icon positions (configurable)
- Closes start menu when clicked

### Start Menu

**File**: `src/components/StartMenu.tsx`

Features:
- App registry-driven content
- Click outside to close
- Escape key support
- Smooth slide-up animation

### App Registry

**File**: `src/apps/registry.ts`

Centralized app configuration:

```typescript
{
  id: string;
  name: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  component: React.LazyExoticComponent;
}
```

All apps are lazy-loaded for optimal performance.

## Applications

### 1. Experience App

**File**: `src/apps/ExperienceApp.tsx`

Features:
- Sidebar navigation with timeline
- Selected state management
- Company, role, duration, location display
- Highlights list with checkmarks

Data structure supports:
- Multiple positions
- Date ranges (start/end)
- Arrays of highlights
- Optional company logo

### 2. Skills App

**File**: `src/apps/SkillsApp.tsx`

Features:
- Categorized skill display
- Progress bars with percentage
- Responsive grid layout
- Animated skill bars

Categories:
- Frontend
- Backend
- Tools

### 3. Projects App

**File**: `src/apps/ProjectsApp.tsx`

Features:
- Grid layout with project cards
- Responsive images (Pexels stock photos)
- Tags and featured badges
- Modal browser for viewing projects
- Sandboxed iframe for security

Browser modal includes:
- macOS-style window controls
- URL display
- Escape key to close
- Click outside to close

### 4. Contact App

**File**: `src/apps/ContactApp.tsx`

Features:
- Accessible form with validation
- Real-time error feedback
- Success state with animation
- Progressive enhancement
- Email validation regex
- Required field checking

## Performance Optimizations

### Code Splitting

Apps are lazy-loaded:
```typescript
component: lazy(() => import('./ExperienceApp'))
```

### Manual Chunking

Vite config splits vendors:
- react-vendor (React, ReactDOM)
- state-vendor (Zustand)
- icons-vendor (Lucide React)

### GPU Acceleration

All animations use GPU-accelerated properties:
- `transform` (not top/left)
- `opacity`
- `will-change` for dragging elements

### Idle Work

Future enhancement: Use `requestIdleCallback` for non-critical updates.

## Accessibility

### ARIA Roles

- Windows: `role="dialog"`
- Desktop: `role="main"`
- Taskbar: `role="navigation"`
- Dock: `role="toolbar"`
- Start Menu: `role="menu"`

### Keyboard Navigation

- Tab navigation between elements
- Enter/Space to activate
- Escape to close modals/menus
- Focus visible indicators

### Screen Readers

- All buttons have `aria-label`
- Form inputs have proper labels
- Error messages use `aria-invalid` and `aria-describedby`
- Focus trapping in modals

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Database Schema

Supabase tables for portfolio data:

### experiences
- id (uuid)
- company, role, duration
- start_date, end_date
- location
- highlights (jsonb)
- logo (text, nullable)

### skills
- id (uuid)
- name, category
- level (0-100)
- icon (text, nullable)

### projects
- id (uuid)
- title, description
- tags (jsonb)
- image, url
- featured (boolean)

All tables have RLS enabled with public read access (portfolio data is public).

## Responsive Design

### Breakpoints

Mobile: < 768px
Desktop: >= 768px

### Mobile Adaptations

- Experience sidebar becomes horizontal
- Grids switch to single column
- Dock hidden on mobile
- Start menu full width

### Device Frame

The entire OS lives inside a responsive container that scales proportionally across devices.

## Future Enhancements

### Extensibility

The architecture supports:
- Adding new apps (just update registry)
- Adding new windows (state-driven)
- Persisting state (add localStorage/IndexedDB sync)
- Multi-window workflows (already supported)

### Potential Features

- Search in start menu
- Window snapping to edges
- Keyboard shortcuts (Alt+Tab)
- Themes (light/dark mode)
- Notifications system
- System tray apps

## Performance Metrics

Target Lighthouse Scores:
- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

Optimizations:
- No blocking scripts
- CLS = 0 (no layout shift)
- GPU-accelerated animations only
- Tree-shaken build
- Code-split by feature
- Lazy-loaded components

## Development

### Running Locally

```bash
npm install
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## Design System

### Colors

- Primary: #0066ff
- Accent: #00d4ff
- Background: #1a1d29
- Surface: #22252f
- Border: #3a3d47
- Text: #ffffff

### Spacing

8px base unit system

### Typography

- System fonts for native feel
- Base: 14px
- Headings: 18-24px
- Small: 11-12px

### Shadows

- Small: 0 1px 3px rgba(0,0,0,0.2)
- Medium: 0 4px 12px rgba(0,0,0,0.3)
- Large: 0 8px 24px rgba(0,0,0,0.4)
- XL: 0 16px 48px rgba(0,0,0,0.5)

### Transitions

- Fast: 150ms
- Base: 250ms
- Slow: 350ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Modern browsers with ES2020 support.
