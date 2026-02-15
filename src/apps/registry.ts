import { lazy } from 'react';
import { AppDefinition } from '../types';

export const appRegistry: Record<string, AppDefinition> = {
  experience: {
    id: 'experience',
    name: 'Experience',
    icon: 'Briefcase',
    defaultWidth: 800,
    defaultHeight: 600,
    component: lazy(() => import('./ExperienceApp')),
  },
  skills: {
    id: 'skills',
    name: 'Skills',
    icon: 'Code2',
    defaultWidth: 700,
    defaultHeight: 500,
    component: lazy(() => import('./SkillsApp')),
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    icon: 'FolderOpen',
    defaultWidth: 900,
    defaultHeight: 650,
    component: lazy(() => import('./ProjectsApp')),
  },
  contact: {
    id: 'contact',
    name: 'Contact',
    icon: 'Mail',
    defaultWidth: 500,
    defaultHeight: 600,
    component: lazy(() => import('./ContactApp')),
  },
};

export const getAppById = (appId: string): AppDefinition | undefined => {
  return appRegistry[appId];
};

export const getAllApps = (): AppDefinition[] => {
  return Object.values(appRegistry);
};
