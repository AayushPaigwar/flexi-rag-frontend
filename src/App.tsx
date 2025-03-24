import { MainLayout } from '@/components/layout/MainLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import ApiPage from '@/pages/ApiPage';
import Chat from '@/pages/Chat'; // Add this import
import CreateUser from '@/pages/CreateUser';
import Dashboard from '@/pages/Dashboard';
import DeploymentsPage from '@/pages/DeploymentsPage';
import DocumentsList from '@/pages/DocumentsList';
import NotFound from '@/pages/NotFound';
import SettingsPage from '@/pages/SettingsPage';
import UploadDocument from '@/pages/UploadDocument';
import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem('currentUserId');
      setIsAuthenticated(!!userId);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  );
}

// Separate component to use useLocation
function AppContent({ isAuthenticated, setIsAuthenticated }: { 
  isAuthenticated: boolean; 
  setIsAuthenticated: (value: boolean) => void;
}) {
  const location = useLocation();

  // Only redirect to dashboard if we're on the root path
  if (location.pathname === '/' && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen">
      {isAuthenticated && <Sidebar className="h-screen" />}
      <main className={`flex-1 overflow-auto ${isAuthenticated ? 'ml-0' : ''}`}>
        <Routes>
          <Route path="/" element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <CreateUser onAuthSuccess={() => setIsAuthenticated(true)} />
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/documents/:userId" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout>
                <DocumentsList />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/upload" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout>
                <UploadDocument />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/deployments" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout>
                <DeploymentsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/api" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout>
                <ApiPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/chat/:documentId" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout>
                <Chat /> {/* Changed from ChatPage to Chat */}
              </MainLayout>
            </ProtectedRoute>
          } />
          
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
  isAuthenticated 
}: { 
  children: React.ReactNode;
  isAuthenticated: boolean;
}) => {
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  
  return <>{children}</>;
};

export default App;
