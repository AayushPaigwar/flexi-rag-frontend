import { useNavigate, useLocation } from 'react-router-dom';

// Custom router hook to provide Next.js-like navigation
export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    // Current path
    pathname: location.pathname,
    
    // Navigation methods
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    
    // Query params helper
    query: Object.fromEntries(new URLSearchParams(location.search)),
    
    // Check if path is active
    isActive: (path: string) => location.pathname.startsWith(path),
  };
}