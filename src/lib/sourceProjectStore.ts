import { create } from 'zustand';
import { supabase } from './supabase';

export interface SourceProject {
  id: string;
  name: string; // mapped from title
  createdAt: string;
  type: string; // Presentation, AI Chat-avatar, Video project, Blank slide
}

interface SourceProjectState {
  projects: SourceProject[];
  fetchProjects: () => Promise<void>;
  addProject: (name: string, type: string) => Promise<void>;
  updateProject: (id: string, newName: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useSourceProjectStore = create<SourceProjectState>((set, get) => ({
  projects: [],

  fetchProjects: async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.title,
          type: p.type,
          createdAt: p.created_at,
        }));
        set({ projects: mapped });
      }
    } catch (e) {
      console.error('Failed to fetch projects from Supabase', e);
    }
  },

  addProject: async (name, type) => {
    try {
      const payload = {
        title: name,
        type: type,
        status: 'ready',
        user_id: '00000000-0000-0000-0000-000000000000',
      };
      const { data, error } = await supabase
        .from('projects')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const newProject = {
          id: data.id,
          name: data.title,
          type: data.type,
          createdAt: data.created_at,
        };
        set({ projects: [newProject, ...get().projects] });
      }
    } catch (e) {
      console.error('Failed to add project to Supabase', e);
    }
  },

  updateProject: async (id, newName) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ title: newName })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        set((state) => ({
          projects: state.projects.map(p => p.id === id ? { ...p, name: data.title } : p)
        }));
      }
    } catch (e) {
      console.error('Failed to update project in Supabase', e);
    }
  },

  deleteProject: async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
      }));
    } catch (e) {
      console.error('Failed to delete project from Supabase', e);
    }
  }
}));

// Auto-fetch on client side init
if (typeof window !== 'undefined') {
  useSourceProjectStore.getState().fetchProjects();
}
