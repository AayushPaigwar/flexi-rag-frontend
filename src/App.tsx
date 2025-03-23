import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import ApiPage from "./pages/ApiPage";
import Chat from "./pages/Chat";
import ChatPage from "./pages/ChatPage";
import CreateUser from "./pages/CreateUser";
import Dashboard from "./pages/Dashboard";
import DeploymentsPage from './pages/DeploymentsPage';
import DocumentsList from "./pages/DocumentsList";
import NotFound from "./pages/NotFound";
import SettingsPage from './pages/SettingsPage';
import UploadDocument from "./pages/UploadDocument";

// Auth protection component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userId = localStorage.getItem('currentUserId');
  
  if (!userId) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const userId = localStorage.getItem('currentUserId');
    setIsAuthenticated(!!userId);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/" element={<CreateUser />} />
            
            {/* Protected routes with BaseLayout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <BaseLayout>
                  <Dashboard />
                </BaseLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/documents/:userId" element={
              <ProtectedRoute>
                <BaseLayout>
                  <DocumentsList />
                </BaseLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/upload" element={
              <ProtectedRoute>
                <BaseLayout>
                  <UploadDocument />
                </BaseLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/chat/:id" element={
              <ProtectedRoute>
                <BaseLayout>
                  <Chat />
                </BaseLayout>
              </ProtectedRoute>
            } />
            
            {/* New routes for Deployments, API, and Settings */}
            <Route path="/deployments" element={
              <ProtectedRoute>
                <BaseLayout>
                  <DeploymentsPage />
                </BaseLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/api" element={
              <ProtectedRoute>
                <BaseLayout>
                  <ApiPage />
                </BaseLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <BaseLayout>
                  <SettingsPage />
                </BaseLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
