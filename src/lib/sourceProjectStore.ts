import { create } from 'zustand';

export interface SourceProject {
  id: string;
  name: string;
  createdAt: string;
  type: string; // Presentation, AI Chat-avatar, Video project, Blank slide
}

interface SourceProjectState {
  projects: SourceProject[];
  addProject: (name: string, type: string) => void;
  deleteProject: (id: string) => void;
}

const DEFAULT_PROJECTS: SourceProject[] = [
  "Virtual PM Template",
  "HR Assistant Template",
  "Product Demo Template",
  "EU AI Act Compliance Training Template",
  "Customer Development Template",
  "Onboarding Template",
  "Internal Communication Template",
  "Corporate Trainings Template",
  "Virtual Recruiter Template",
  "Customer Support Template",
  "Anti-Bribery & Anti-Corruption Template",
].map((name, index) => ({
  id: `sys-proj-${index + 1}`,
  name,
  createdAt: new Date().toISOString(),
  type: 'Presentation'
}));

export const useSourceProjectStore = create<SourceProjectState>((set) => ({
  projects: DEFAULT_PROJECTS,

  addProject: (name, type) => {
    set((state) => ({
      projects: [
        {
          id: `proj-${Date.now()}`,
          name,
          type,
          createdAt: new Date().toISOString()
        },
        ...state.projects
      ]
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter(p => p.id !== id)
    }));
  }
}));
