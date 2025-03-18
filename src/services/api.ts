
/**
 * API Service for communicating with the FlexiRAG backend
 */
const API_BASE_URL = 'http://localhost:8000/api/v1';

const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'API request failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.detail || `Error: ${response.status} ${response.statusText}`;
    } catch (e) {
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

export const signInWithOtp = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/users/signin-otp/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  return handleApiError(response);
};

export const verifyOtp = async (email: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/verify-otp/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, token }),
  });
  return handleApiError(response);
};

export const getUserDocuments = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/documents`);
  return handleApiError(response);
};

export const uploadDocument = async (file: File, userId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/documents/upload/?user_id=${userId}`, {
    method: 'POST',
    body: formData,
  });
  return handleApiError(response);
};

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

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  created_at: string;
  email_verified?: boolean;
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
