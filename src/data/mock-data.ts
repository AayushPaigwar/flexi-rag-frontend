
import { ModelCardProps } from '@/components/models/ModelCard';
import { Message } from '@/components/chat/ChatInterface';
import { FileItem } from '@/components/upload/FileUpload';

// Mock RAG Models
export const mockModels: ModelCardProps[] = [
  {
    id: '1',
    name: 'Product Documentation',
    description: 'RAG model trained on our product documentation and user guides.',
    status: 'deployed',
    sources: 12,
    updatedAt: '2 days ago',
    url: 'https://product-docs-rag.vercel.app',
  },
  {
    id: '2',
    name: 'Company Handbook',
    description: 'Internal knowledge base for company policies and procedures.',
    status: 'training',
    sources: 8,
    updatedAt: '5 hours ago',
  },
  {
    id: '3',
    name: 'Research Papers',
    description: 'Scientific papers and research articles on machine learning and AI.',
    status: 'draft',
    sources: 5,
    updatedAt: '1 week ago',
  },
  {
    id: '4',
    name: 'Customer Support',
    description: 'Support articles and troubleshooting guides for customer inquiries.',
    status: 'deployed',
    sources: 25,
    updatedAt: '3 days ago',
    url: 'https://support-rag.vercel.app',
  },
];

// Mock Chat Messages
export const mockChatMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'How do I configure vector retrieval depth?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: '2',
    role: 'assistant',
    content: 'To configure the vector retrieval depth in your RAG model, navigate to the "Models" section in your dashboard, select your model, and click on "Settings". Under the "Retrieval" tab, you can adjust the "Top K" parameter, which determines how many documents are retrieved for context. A higher value will provide more comprehensive context but might dilute relevance, while a lower value will be more focused but potentially miss relevant information. For most cases, a value between 3-5 works well.',
    timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
  },
  {
    id: '3',
    role: 'user',
    content: 'What file formats can I upload to train my RAG model?',
    timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
  },
  {
    id: '4',
    role: 'assistant',
    content: 'You can upload several file formats to train your RAG model:\n\n• PDF documents (.pdf)\n• Plain text files (.txt)\n• CSV data files (.csv)\n• JSON documents (.json)\n\nThe system will automatically extract text content, split it into appropriate chunks, and create embeddings for retrieval. For best results, ensure your documents are well-structured and contain relevant information for the domain your RAG model will operate in.',
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
  },
];

// Mock Uploaded Files
export const mockUploadedFiles: FileItem[] = [
  {
    id: '1',
    name: 'product-manual.pdf',
    size: 2.5 * 1024 * 1024, // 2.5 MB
    type: 'application/pdf',
    status: 'success',
    progress: 100,
  },
  {
    id: '2',
    name: 'quarterly-data.csv',
    size: 0.8 * 1024 * 1024, // 0.8 MB
    type: 'text/csv',
    status: 'success',
    progress: 100,
  },
  {
    id: '3',
    name: 'research-findings.txt',
    size: 0.3 * 1024 * 1024, // 0.3 MB
    type: 'text/plain',
    status: 'uploading',
    progress: 65,
  },
];

// Mock API Keys
export const mockApiKeys = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'flxi_prod_7f8a9d6e5b3c2a1',
    created: '2023-10-15',
    lastUsed: '2023-11-02',
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'flxi_dev_3e4d5f6g7h8i9j0',
    created: '2023-09-20',
    lastUsed: '2023-11-01',
  },
];

// Mock Deployment Stats
export const mockDeploymentStats = {
  totalDeployments: 5,
  activeDeployments: 3,
  totalRequests: 1247,
  averageLatency: 245, // ms
};

// Mock Usage Stats
export const mockUsageStats = {
  totalQueries: 3542,
  totalUploads: 45,
  totalStorage: 128.5, // MB
  averagePrecision: 92.7, // %
};
