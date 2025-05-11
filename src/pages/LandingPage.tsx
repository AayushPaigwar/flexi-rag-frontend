import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/router";
import { FileText, Github, MessageSquare, Server, Speech } from "lucide-react";
import { useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Update document title
    document.title = "FlexiRAG - Document Management & AI Platform";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-lg bg-white/80">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">FlexiRAG</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#use-cases"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Use Cases
            </a>
            <a
              href="#faq"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/aayushpaigwar/flexi-rag-nest"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Star on GitHub</span>
              {/* <span className="flex items-center justify-center h-5 min-w-[20px] px-1 bg-white text-gray-800 rounded-full text-xs font-semibold">
                ⭐
              </span> */}
            </a>
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="hidden sm:inline-flex"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 -z-10" />
          <div className="container px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row items-center">
            <div className="flex-1 space-y-6 mb-10 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                <span className="block">Unlock the Power of Your</span>
                <span className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Documents with AI
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 max-w-2xl">
                Upload, query, and deploy documents as API endpoints using
                natural language. FlexiRAG makes document management smarter
                with Gemini AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => router.push("/login")}
                  size="lg"
                  className="text-base bg-blue-600 hover:bg-blue-700"
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base"
                  onClick={() => {
                    const element = document.getElementById("how-it-works");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="animate-float">
                <div className="bg-white shadow-xl rounded-lg border p-6 max-w-md mx-auto">
                  <div className="flex mb-4 items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <div className="text-sm font-semibold">Document Chat</div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded p-3 max-w-[80%]">
                      What are the key findings in the Q4 report?
                    </div>
                    <div className="bg-blue-100 rounded p-3 ml-auto max-w-[80%]">
                      The Q4 report highlights a 23% increase in revenue, new
                      partnership opportunities, and plans for expansion into
                      Asian markets in the next fiscal year.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container px-4 sm:px-8 lg:px-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Powerful Features for Document Intelligence
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                FlexiRAG combines cutting-edge AI with intuitive design to
                transform how you interact with documents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Document Upload & Management
                </h3>
                <p className="text-gray-600">
                  Upload various document types and manage them all in one
                  secure place with smart categorization.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Natural Language Querying
                </h3>
                <p className="text-gray-600">
                  Ask questions about your documents in plain language and get
                  accurate, contextual responses.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Server className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">API Deployment</h3>
                <p className="text-gray-600">
                  Deploy documents as API endpoints for seamless integration
                  with your applications and services.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Speech className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Gemini AI Integration
                </h3>
                <p className="text-gray-600">
                  Powered by Google's Gemini AI for accurate, context-aware
                  responses to your document queries.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  User-Friendly Interface
                </h3>
                <p className="text-gray-600">
                  Clean, intuitive dashboard for easy document management,
                  processing, and analysis.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Secure Document Storage
                </h3>
                <p className="text-gray-600">
                  Keep your documents secure with enterprise-grade encryption
                  and access controls.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-blue-50">
          <div className="container px-4 sm:px-8 lg:px-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                How FlexiRAG Works
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                A simple three-step process to unlock document intelligence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white rounded-lg p-8 shadow-lg text-center relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-lg">
                  1
                </div>
                <div className="flex justify-center mb-6">
                  <FileText className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload Documents</h3>
                <p className="text-gray-600">
                  Upload PDFs, Word docs, Excel files, and more to the secure
                  FlexiRAG platform.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-lg p-8 shadow-lg text-center relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-lg">
                  2
                </div>
                <div className="flex justify-center mb-6">
                  <MessageSquare className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Query with Natural Language
                </h3>
                <p className="text-gray-600">
                  Ask questions about your documents in plain English and get
                  immediate answers.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-lg p-8 shadow-lg text-center relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-lg">
                  3
                </div>
                <div className="flex justify-center mb-6">
                  <Server className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Deploy as API</h3>
                <p className="text-gray-600">
                  Turn your documents into API endpoints for easy integration
                  with your applications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="py-20 bg-white">
          <div className="container px-4 sm:px-8 lg:px-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Use Cases</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Discover how FlexiRAG can transform document workflows across
                industries
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Use Case 1 */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 shadow-md">
                <h3 className="text-xl font-semibold mb-3">
                  Legal Document Analysis
                </h3>
                <p className="text-gray-700 mb-4">
                  Enable lawyers to quickly search through case files,
                  contracts, and legal documents to find relevant precedents and
                  information.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-1 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Accelerate legal research and discovery</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-1 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Extract key clauses and terms</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-1 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Summarize lengthy legal documents</span>
                  </li>
                </ul>
              </div>

              {/* Use Case 2 */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 shadow-md">
                <h3 className="text-xl font-semibold mb-3">
                  Customer Support Knowledge Base
                </h3>
                <p className="text-gray-700 mb-4">
                  Create an AI-powered knowledge base that support teams can
                  query to find answers to customer questions quickly.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-1 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Reduce response times by 70%</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-1 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Improve customer satisfaction</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-1 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Centralize product documentation</span>
                  </li>
                </ul>
              </div>

              {/* Use Case 3 */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 shadow-md">
                <h3 className="text-xl font-semibold mb-3">
                  Research & Development
                </h3>
                <p className="text-gray-700 mb-4">
                  Help R&D teams extract insights from research papers, patents,
                  and technical documentation.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-1 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Accelerate discovery processes</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-1 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Connect related research findings</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-1 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Identify innovative opportunities</span>
                  </li>
                </ul>
              </div>

              {/* Use Case 4 */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 shadow-md">
                <h3 className="text-xl font-semibold mb-3">
                  Educational Content Management
                </h3>
                <p className="text-gray-700 mb-4">
                  Transform educational institutions' document libraries into
                  interactive learning resources.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-1 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Create dynamic learning materials</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-1 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Enable self-paced learning</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-1 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Improve knowledge retention</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-blue-50">
          <div className="container px-4 sm:px-8 lg:px-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Everything you need to know about FlexiRAG
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {/* FAQ Item 1 */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-2">
                  What types of files does FlexiRAG support?
                </h3>
                <p className="text-gray-600">
                  FlexiRAG supports a wide range of document formats including
                  PDF, Word documents (.docx, .doc), Excel spreadsheets (.xlsx,
                  .xls), PowerPoint presentations (.pptx, .ppt), plain text
                  (.txt), and rich text format (.rtf). Support for additional
                  formats is continually being added.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-2">
                  Is my data secure with FlexiRAG?
                </h3>
                <p className="text-gray-600">
                  Absolutely. FlexiRAG employs enterprise-grade security
                  measures including end-to-end encryption, secure access
                  controls, and regular security audits. Your documents are
                  stored securely and are never shared with third parties
                  without your explicit permission.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-2">
                  How accurate are FlexiRAG's responses?
                </h3>
                <p className="text-gray-600">
                  FlexiRAG uses Google's Gemini AI to provide highly accurate
                  responses. The system is trained to understand context and
                  provide relevant information directly from your documents. It
                  continuously improves through machine learning, becoming more
                  accurate with usage.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-2">
                  How do I integrate FlexiRAG's API with my applications?
                </h3>
                <p className="text-gray-600">
                  FlexiRAG provides a simple REST API with comprehensive
                  documentation. After deploying a document as an API endpoint,
                  you'll receive an API key and endpoint URL. You can then use
                  standard HTTP requests to query your documents from any
                  application or service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
          <div className="container px-4 sm:px-8 lg:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your Document Experience?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Join thousands of users who are already leveraging FlexiRAG to
              make their documents work smarter.
            </p>
            <Button
              onClick={() => router.push("/login")}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
            >
              Get Started Now
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">FlexiRAG</span>
              </div>
              <p className="text-sm max-w-xs opacity-80">
                Transform your document experience with AI-powered document
                intelligence.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white font-semibold mb-3">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#features"
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#use-cases"
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      Use Cases
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-80">
              © 2025 FlexiRAG. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
