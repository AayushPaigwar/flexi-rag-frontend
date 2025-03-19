
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import CreateUser from "./pages/CreateUser";
import UploadDocument from "./pages/UploadDocument";
import DocumentsList from "./pages/DocumentsList";
import Chat from "./pages/Chat";
import { MainLayout } from "./components/layout/MainLayout";
import { useEffect, useState } from "react";

// Auth protection component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userId = localStorage.getItem('currentUserId');
  
  if (!userId) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

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
            
            {/* Protected routes with MainLayout */}
            <Route path="/upload" element={
              <ProtectedRoute>
                <MainLayout>
                  <UploadDocument />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/documents/:userId" element={
              <ProtectedRoute>
                <MainLayout>
                  <DocumentsList />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/chat/:id" element={
              <ProtectedRoute>
                <MainLayout>
                  <Chat />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
