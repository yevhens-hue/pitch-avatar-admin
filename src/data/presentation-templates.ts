export interface PresentationTemplate {
  id: string;
  name: string;
  description: string;
  productTypes: string[];
  projectType: string;
  tags: string[];
  slideCount: number;
  templateType: 'copy' | 'generate';
  accessType?: 'system' | 'active' | 'inactive';
  selectedProjectId?: string;
  badge?: 'Popular' | 'New' | 'Hot';
  isOnHomepage?: boolean;
  order?: number;
  createdAt?: string;
}
