/**
 * API Service for communicating with the FlexiRAG backend
 */
const API_BASE_URL = 'https://flexi-rag.azurewebsites.net/api/v1';
// export const API_BASE_URL = 'http://localhost:8000/api/v1';

const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'API request failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.detail || `Error: ${response.status} ${response.statusText}`;
      console.error("API Error:", errorMessage, errorData); // Log detailed error information
    } catch (e) {
      errorMessage = `Error: ${response.status} ${response.statusText}`;
      console.error("Error parsing API response:", e); // Log parsing error
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

// User API
export const signInWithOtp = async (email: string) => {
  try {
    if (!email || !email.includes('@')) {
      throw new Error("Invalid email address provided.");
    }

    const response = await fetch(`${API_BASE_URL}/users/signin-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return handleApiError(response);
  } catch (error) {
    console.error("Sign in OTP error:", error); // Log error
    throw error;
  }
};

export const verifyOtp = async (data: { 
  email: string; 
  token: string; 
  name?: string;
  phone_number?: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/verify-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return handleApiError(response);
  } catch (error) {
    console.error("Verify OTP error:", error); // Log error
    throw error;
  }
};

// Update the logoutUser function with the correct endpoint
// export const logoutUser = async (email: string) => {
//   try {
//     console.log("Logging out user:", email);
    
//     const response = await fetch(`${API_BASE_URL}/users/logout/`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email }),
//     });
    
//     return handleApiError(response);
//   } catch (error) {
//     console.error("Logout user error:", error);
//     throw error;
//   }
// };

// Document API
export const getUserDocuments = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/documents`);
    return handleApiError(response);
  } catch (error) {
    console.error("Get user documents error:", error); // Log error
    throw error;
  }
};

export const uploadDocument = async (file: File, userId: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/documents/upload/?user_id=${userId}`, {
      method: 'POST',
      body: formData,
    });
    return handleApiError(response);
  } catch (error) {
    console.error("Upload document error:", error); // Log error
    throw error;
  }
};

export const queryDocument = async (documentId: string, query: string) => {
  try {
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
  } catch (error) {
    console.error("Query document error:", error); // Log error
    throw error;
  }
};

// Deployment API
export const deployDocument = async (documentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleApiError(response);
  } catch (error) {
    console.error("Deploy document error:", error); // Log error
    throw error; // Ensure the error is thrown so it can be caught and displayed in the UI
  }
};

export const queryDeployedDocument = async (documentId: string, query: string, apiKey?: string) => {
  try {
    const body: any = { query };
    if (apiKey) {
      body.api_key = apiKey;
    }
    
    const response = await fetch(`${API_BASE_URL}/deployed/${documentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return handleApiError(response);
  } catch (error) {
    console.error("Query deployed document error:", error); // Log error
    throw error;
  }
};

// API Key Management
export const addGeminiApiKey = async (userId: string, apiKey: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        api_key: apiKey,
      }),
    });
    return handleApiError(response);
  } catch (error) {
    console.error("Add Gemini API key error:", error); // Log error
    throw error;
  }
};

// Interface definitions
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

// Update the DeploymentResponse type
export interface DeploymentResponse {
  document_id: string;
  file_name: string;
  endpoint: string;
  instructions: string;
  requires_api_key: boolean;
}

export const getDeployedDocuments = async (userId: string) => {
  try {
    console.log("Fetching deployed documents for user:", userId);
    
    const response = await fetch(`${API_BASE_URL}/documents/deployed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    const data = await handleApiError(response);
    console.log("Deployed documents data:", data);
    return data || []; // Ensure we return an array even if empty
  } catch (error) {
    console.error("Get deployed documents error:", error);
    throw error;
  }
};

export const getAvailableDocuments = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/available`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });
    return handleApiError(response);
  } catch (error) {
    console.error("Get available documents error:", error);
    throw error;
  }
};

// Add this interface
interface GeminiKeyResponse {
  status: string;
  gemini_api_key: string;
  message: string;
}

// Add this function
export const getGeminiApiKey = async (userId: string): Promise<GeminiKeyResponse> => {

  console.log("getGeminiApiKey Userid :", userId);
  const response = await fetch(`${API_BASE_URL}/keys/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch API key');
  }
  
  return response.json();
};