# Document RAG API Documentation

## Overview

The Document RAG API is a Retrieval-Augmented Generation system that allows users to upload documents and query them using natural language. The system uses Gemini AI for text generation and Supabase for vector storage and document management.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

The API uses an email-based OTP (One-Time Password) authentication system. Users can either sign up or sign in using their email address.

### Users

#### Create User / Sign Up

```http
POST /users/
```

Start the sign-up process with OTP verification.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+1234567890"  // Optional
}
```

**Response:**

```json
{
  "message": "Please check your email for OTP verification",
  "verification_required": true,
  "is_signin": false,
  "temp_user_data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+1234567890"
  }
}
```

#### Sign In with OTP

```http
POST /users/signin-otp/
```

Initiate sign-in for existing users.

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "message": "OTP sent to email. Please check your inbox."
}
```

#### Verify OTP

```http
POST /users/verify-otp/
```

Verify OTP for both sign-up and sign-in flows.

**Request Body:**

For new users (sign-up):

```json
{
  "email": "john@example.com",
  "token": "123456",
  "name": "John Doe",
  "phone_number": "+1234567890"  // Optional
}
```

For existing users (sign-in):

```json
{
  "email": "john@example.com",
  "token": "123456"
}
```

**Response:**

For new users:

```json
{
  "message": "User created and verified successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+1234567890",
    "email_verified": true
  },
  "is_new_user": true
}
```

For existing users:

```json
{
  "message": "Successfully signed in",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+1234567890",
    "email_verified": true
  },
  "is_new_user": false
}
```

### Documents

#### Upload Document

```http
POST /documents/upload/
```

Upload and process a document for a specific user.

**Parameters:**

- `file`: The document file (multipart/form-data)
- `user_id`: UUID of the user (query parameter)

**Supported File Types:**

- PDF (.pdf)
- Text (.txt)
- Word (.docx)
- CSV (.csv)
- Excel (.xlsx, .xls)
- JSON (.json)

**Response:**

```json
{
  "message": "Document uploaded and processed successfully",
  "document_id": "uuid"
}
```

#### Get User Documents

```http
GET /users/{user_id}/documents
```

Retrieve all documents for a specific user.

**Response:**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "file_name": "document.pdf",
    "file_type": "pdf",
    "created_at": "2024-01-09T12:00:00Z"
  }
]
```

#### Deploy Document

```http
POST /documents/{document_id}/deploy/
```

Deploy a document and get a deployment endpoint that can be used for querying.

**Parameters:**

- `document_id`: UUID of the document to deploy (path parameter)

**Response:**

```json
{
  "endpoint": "http://localhost:8000/api/v1/deployed/uuid",
  "document_id": "uuid",
  "instructions": "Your document is now deployed. You can query it using the provided endpoint.",
  "requires_api_key": false
}
```

If the user doesn't have a Gemini API key configured:

```json
{
  "endpoint": "http://localhost:8000/api/v1/deployed/uuid",
  "document_id": "uuid",
  "instructions": "To use this deployment, you need to add your Gemini API key first.",
  "requires_api_key": true
}
```

#### Add Gemini API Key

```http
POST /users/gemini-api-key/
```

Add or update a user's Gemini API key for document deployments.

**Request Body:**

```json
{
  "user_id": "uuid",
  "api_key": "your-gemini-api-key"
}
```

**Response:**

```json
{
  "message": "API key added successfully"
}
```

### Querying

#### Query Document

```http
POST /query/
```

Query a specific document using natural language.

**Request Body:**

```json
{
  "document_id": "uuid",
  "query": "What are the main points in the document?"
}
```

**Response:**

```json
{
  "query": "What are the main points in the document?",
  "answer": "Based on the document...",
  "source_documents": [
    "Document: example.pdf\nContent..."
  ],
  "sources": [
    "example.pdf"
  ]
}
```

#### Query Deployed Document

```http
POST /deployed/{document_id}
```

Query a deployed document using its deployment endpoint.

**Parameters:**

- `document_id`: UUID of the deployed document (path parameter)

**Request Body:**

```json
{
  "query": "What are the main points in the document?",
  "api_key": "your-gemini-api-key"  // Optional, required only if user hasn't added their API key
}
```

**Response:**

```json
{
  "query": "What are the main points in the document?",
  "answer": "Based on the document...",
  "source_documents": [
    "Document: example.pdf\nContent..."
  ],
  "sources": [
    "example.pdf"
  ]
}
```

**Error Response (Missing API Key):**

```json
{
  "detail": "API key is required for this deployment"
}
```

## Error Responses

The API uses standard HTTP status codes:

- `200 OK`: Request successful
- `400 Bad Request`: Invalid input
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error Response Format:

```json
{
  "detail": "Error message"
}
```

## Rate Limiting

Currently, there are no rate limits implemented.

## Development

### Local Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Set up environment variables in `.env`:

```
GEMINI_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

3. Run the API:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### API Documentation UI

- Swagger UI: `/docs`
- ReDoc: `/redoc`

## Notes

- All timestamps are in UTC
- UUIDs are used for all IDs
- Document processing includes text extraction and chunking
- Vector embeddings are generated using the "all-mpnet-base-v2" model
- Responses are paginated where applicable
