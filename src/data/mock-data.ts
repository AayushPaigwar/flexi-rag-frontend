// Mock data for the application

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
}

export interface Model {
  id: string;
  document_id: string;
  name: string;
  description: string;
  status: 'deployed' | 'training' | 'draft';
  createdAt?: string;
}

export const mockCurrentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone_number: '+1 (555) 123-4567',
};

export const mockModels: Model[] = [
  {
    id: '1',
    document_id: 'doc-1',
    name: 'Product Documentation',
    description: 'RAG model trained on product documentation and FAQs',
    status: 'deployed',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    document_id: 'doc-2',
    name: 'Technical Specs',
    description: 'Technical specifications and API documentation',
    status: 'training',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    document_id: 'doc-3',
    name: 'User Manual',
    description: 'Comprehensive user manual and guides',
    status: 'draft',
    createdAt: '2024-01-25',
  },
];
