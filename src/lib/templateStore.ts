import { create } from 'zustand';
import { PresentationTemplate } from '@/data/presentation-templates';
import { supabase } from './supabase';

interface TemplateState {
  templates: PresentationTemplate[];
  fetchTemplates: () => Promise<void>;
  addTemplate: (template: PresentationTemplate) => Promise<void>;
  updateTemplate: (id: string, updates: Partial<PresentationTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],

  fetchTemplates: async () => {
    try {
      const { data, error } = await supabase
        .from('presentation_templates')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      if (data) {
        set({ templates: data as PresentationTemplate[] });
      }
    } catch (e) {
      console.error('Failed to fetch templates from Supabase', e);
    }
  },

  addTemplate: async (template) => {
    try {
      // Remove id and createdAt so Supabase can generate them if needed,
      // or pass them if we really want to override. Usually Supabase defaults handle this.
      const { id, createdAt, ...rest } = template;
      
      const { data, error } = await supabase
        .from('presentation_templates')
        .insert([rest])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        set({ templates: [...get().templates, data as PresentationTemplate] });
      }
    } catch (e) {
      console.error('Failed to add template to Supabase', e);
    }
  },

  updateTemplate: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('presentation_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        set((state) => ({
          templates: state.templates.map((t) => (t.id === id ? (data as PresentationTemplate) : t))
        }));
      }
    } catch (e) {
      console.error('Failed to update template in Supabase', e);
    }
  },

  deleteTemplate: async (id) => {
    try {
      const { error } = await supabase
        .from('presentation_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        templates: state.templates.filter((t) => t.id !== id)
      }));
    } catch (e) {
      console.error('Failed to delete template from Supabase', e);
    }
  }
}));

// Auto-fetch on client side init
if (typeof window !== 'undefined') {
  useTemplateStore.getState().fetchTemplates();
}
