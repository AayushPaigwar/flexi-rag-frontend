
/**
 * API Service for communicating with the FlexiRAG backend
 */

const API_BASE_URL = 'https://custom-rag-production.up.railway.app/api/v1';

// User API
export const createUser = async (userData: { name: string; email: string; phone_number?: string }) => {
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  return response.json();
};

export const getUserDocuments = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/documents`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user documents');
  }
  
  return response.json();
};

// Document API
export const uploadDocument = async (file: File, userId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/documents/upload/?user_id=${userId}`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload document');
  }
  
  return response.json();
};

// Query API
export const queryDocument = async (documentId: string, query: string) => {
  const response = await fetch(`${API_BASE_URL}/query/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      document_id: documentId,
      query: query,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to query document');
  }
  
  return response.json();
};

// Types
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  created_at: string;
}

export interface ApiDocument {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  created_at: string;
}

export interface ApiQueryResponse {
  query: string;
  answer: string;
  source_documents: string[];
  sources: string[];
}
