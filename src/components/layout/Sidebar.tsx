import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Upload, 
  FileText, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Server,
  Key,
  Settings
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { logoutUser } from '@/services/api';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const email = localStorage.getItem('currentUserEmail');
    const name = localStorage.getItem('currentUserName');
    const id = localStorage.getItem('currentUserId');
    
    if (email) setUserEmail(email);
    if (name) setUserName(name);
    if (id) setUserId(id);
  }, []);

  const handleLogout = async () => {
    try {
      if (userEmail) {
        await logoutUser(userEmail);
      }
      
      localStorage.removeItem('currentUserEmail');
      localStorage.removeItem('currentUserName');
      localStorage.removeItem('currentUserId');
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`flex flex-col h-full border-r bg-background ${expanded ? 'w-64' : 'w-20'} transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between p-4 border-b">
        {expanded ? (
          <h1 className="text-xl font-bold">FlexiRAG</h1>
        ) : (
          <h1 className="text-xl font-bold">FR</h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setExpanded(!expanded)}
          className="ml-auto"
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          <Link to="/dashboard">
            <Button 
              variant={isActive('/dashboard') ? "secondary" : "ghost"} 
              className={`w-full justify-start mb-1 ${expanded ? '' : 'justify-center'}`}
            >
              <Home className="mr-2 h-5 w-5" />
              {expanded && <span>Dashboard</span>}
            </Button>
          </Link>
          
          <Link to={`/documents/${userId}`}>
            <Button 
              variant={isActive('/documents') ? "secondary" : "ghost"} 
              className={`w-full justify-start mb-1 ${expanded ? '' : 'justify-center'}`}
            >
              <FileText className="mr-2 h-5 w-5" />
              {expanded && <span>Documents</span>}
            </Button>
          </Link>
          
          <Link to="/upload">
            <Button 
              variant={isActive('/upload') ? "secondary" : "ghost"} 
              className={`w-full justify-start mb-1 ${expanded ? '' : 'justify-center'}`}
            >
              <Upload className="mr-2 h-5 w-5" />
              {expanded && <span>Upload</span>}
            </Button>
          </Link>
          
          <Link to="/deployments">
            <Button 
              variant={isActive('/deployments') ? "secondary" : "ghost"} 
              className={`w-full justify-start mb-1 ${expanded ? '' : 'justify-center'}`}
            >
              <Server className="mr-2 h-5 w-5" />
              {expanded && <span>Deployments</span>}
            </Button>
          </Link>
          
          <Link to="/api">
            <Button 
              variant={isActive('/api') ? "secondary" : "ghost"} 
              className={`w-full justify-start mb-1 ${expanded ? '' : 'justify-center'}`}
            >
              <Key className="mr-2 h-5 w-5" />
              {expanded && <span>API Access</span>}
            </Button>
          </Link>
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <Link to="/settings">
          <Button 
            variant={isActive('/settings') ? "secondary" : "ghost"} 
            className={`w-full justify-start mb-4 ${expanded ? '' : 'justify-center'}`}
          >
            <Settings className="mr-2 h-5 w-5" />
            {expanded && <span>Settings</span>}
          </Button>
        </Link>
        
        <div className={`flex items-center ${expanded ? 'justify-between' : 'justify-center'} mb-2`}>
          {expanded && (
            <div className="truncate">
              <p className="text-sm font-medium truncate">{userName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
