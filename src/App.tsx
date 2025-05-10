import { MainLayout } from "@/components/layout/MainLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import ApiPage from "@/pages/ApiPage";
import Chat from "@/pages/Chat";
import CreateUser from "@/pages/CreateUser";
import Dashboard from "@/pages/Dashboard";
import DeploymentsPage from "@/pages/DeploymentsPage";
import DocumentsList from "@/pages/DocumentsList";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/NotFound";
import SettingsPage from "@/pages/SettingsPage";
import UploadDocument from "@/pages/UploadDocument";
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem("currentUserId");
      setIsAuthenticated(!!userId);
      setIsLoading(false);
    };

    checkAuth();

    // Add event listener for storage changes
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary">
          <svg
            className="h-12 w-12 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
    </Router>
  );
}

// Separate component to use useLocation
function AppContent({
  isAuthenticated,
  setIsAuthenticated,
}: {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}) {
  const location = useLocation();

  return (
    <div className="flex h-screen">
      {isAuthenticated && location.pathname !== "/" && (
        <Sidebar className="h-screen" />
      )}
      <main
        className={`flex-1 overflow-auto ${
          isAuthenticated && location.pathname !== "/" ? "ml-0" : ""
        }`}
      >
        <Routes>
          {/* Landing page as the default entry point */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LandingPage />
              )
            }
          />

          {/* Login/Create user page */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <CreateUser onAuthSuccess={() => setIsAuthenticated(true)} />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/documents/:userId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainLayout>
                  <DocumentsList />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainLayout>
                  <UploadDocument />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/deployments"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainLayout>
                  <DeploymentsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/api"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainLayout>
                  <ApiPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat/:documentId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainLayout>
                  <Chat />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

// Updated ProtectedRoute component
const ProtectedRoute = ({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default App;
