<p align="center">
  <img src="https://github.com/user-attachments/assets/92d92469-4bb3-4698-9db0-3b0bbe8718a1" alt="FlexiRAG Logo" width="200" height="200" />
</p>
<p align="center">
  <a href="https://flexirag.vercel.app/" target="_blank"><strong>FlexiRAG - Flexible Retrieval Augmented Generation </strong></a>
</p>

<p align="center">

  <!-- First Line: Deployment + GitHub -->
  <a href="https://flexirag.vercel.app/">
    <img src="https://vercelbadge.vercel.app/api/aayushpaigwar/flexi-rag-frontend" alt="Vercel" />
  </a>
  <img src="https://img.shields.io/github/stars/AayushPaigwar/flexi-rag-frontend?style=social" alt="GitHub Repo stars" />

</p>

<p align="center">

  <!-- Second Line: Tech Stack -->
  <img src="https://img.shields.io/badge/Frontend-React-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Build-Vite-purple?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Language-Python-3776AB?logo=python&logoColor=white" alt="Python" />

</p>







# FlexiRAG - Flexible Retrieval Augmented Generation

FlexiRAG is a powerful document RAG (Retrieval Augmented Generation) platform that allows you to upload, deploy, and query documents through an intuitive interface and API.

## 🚀 Features

* **Document Management**: Upload and manage various document types
* **RAG Deployments**: Deploy documents as queryable API endpoints
* **Chat Interface**: Interact with your documents through a conversational UI
* **API Access**: Programmatically access your deployed documents
* **Gemini Integration**: Leverage Google's Gemini AI for document understanding

## 🛠️ Tech Stack

This project is built with modern web technologies:

* **Frontend**:
  * React with TypeScript
  * Vite for fast development and building
  * Tailwind CSS for styling
  * shadcn/ui for UI components
  * React Router for navigation

* **Backend**:
  * FastAPI (Python)
  * Supabase for authentication and storage
  * Google Gemini AI for document processing

## 📋 Prerequisites

* Node.js & npm (or bun)
* Python 3.8+ (for backend development)
* Gemini API key (for document deployments)

## 🚦 Getting Started

### Frontend Setup

1. Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd flexi-rag-nest
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at <http://localhost:8080>

### Backend Setup

1. Install Python dependencies:

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

## 📚 Documentation

The API documentation is available at:

* Swagger UI: `/docs`
* ReDoc: `/redoc`

## 🔄 Workflow

1. Create an account or sign in
2. Upload documents to your library
3. Deploy documents as API endpoints
4. Query documents through the chat interface or API
5. Manage deployments and API keys in the settings

## 🔑 API Usage

Once you've deployed a document, you can query it using the provided endpoint:

```http
POST https://flexi-rag.azurewebsites.net/api/v1/deployed/{document_id}
Content-Type: application/json

{
  "query": "Your question about the document",
  "api_key": "your_gemini_api_key" // Optional, if configured in settings
}
```

## 🧩 Project Structure

```
flexi-rag-nest/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Application pages
│   ├── services/       # API services
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── App.tsx         # Main application component
├── public/             # Static assets
└── ...                 # Configuration files
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

* [Deployed Link](https://flexirag.vercel.app)

---

Built with ❤️ using modern web technologies
