
/**
 * API Service for communicating with the FlexiRAG backend
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Helper function to handle API errors
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'API request failed';
    
    try {
      // Try to get a detailed error message from the response
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || `Error: ${response.status} ${response.statusText}`;
    } catch (e) {
      // If parsing JSON fails, use the status text
      errorMessage = `Error: ${response.status} ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json();
};

// User API
export const createUser = async (userData: { name: string; email: string; phone_number?: string }) => {
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  return handleApiError(response);
};

export const getUserDocuments = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/documents`);
  return handleApiError(response);
};

// Document API
export const uploadDocument = async (file: File, userId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/documents/upload/?user_id=${userId}`, {
    method: 'POST',
    body: formData,
  });
  
  return handleApiError(response);
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
  
  return handleApiError(response);
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
