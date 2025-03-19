import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  Code,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Server,
  Settings,
  Upload,
  User
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    const email = localStorage.getItem('currentUserEmail');
    const name = localStorage.getItem('currentUserName');
    const id = localStorage.getItem('currentUserId');
    
    if (email) setUserEmail(email);
    if (name) setUserName(name);
    if (id) setUserId(id);
  }, []);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentUserEmail');

    toast({
      title: "Success",
      description: "Logged out successfully",
    });

    navigate('/');
  };

  return (
    <aside
      className={cn(
        'h-screen bg-background border-r border-border transition-all duration-300 ease-in-out flex flex-col',
        expanded ? 'w-64' : 'w-16',
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {expanded ? (
          <h1 className="text-xl font-medium animate-fade-in">FlexiRAG</h1>
        ) : (
          <div className="w-full flex justify-center">
            <span className="font-semibold text-primary">F</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {expanded ? <ChevronRight size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            to={`/documents/${userId}`} 
            label="Dashboard" 
            expanded={expanded} 
          />
          <NavItem 
            icon={<FileText size={20} />} 
            to={`/documents/${userId}`} 
            label="My Documents" 
            expanded={expanded} 
          />
          <NavItem 
            icon={<MessageSquare size={20} />} 
            to="/chat" 
            label="Chat Interface" 
            expanded={expanded} 
          />
          <NavItem 
            icon={<Upload size={20} />} 
            to="/upload" 
            label="Upload Data" 
            expanded={expanded} 
          />
          <NavItem 
            icon={<Server size={20} />} 
            to="/deployments" 
            label="Deployments" 
            expanded={expanded} 
          />
          <NavItem 
            icon={<Code size={20} />} 
            to="/api" 
            label="API Access" 
            expanded={expanded} 
          />
          <NavItem 
            icon={<Settings size={20} />} 
            to="/settings" 
            label="Settings" 
            expanded={expanded} 
          />
        </ul>
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-200",
          expanded ? "justify-between" : "justify-center"
        )}>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary p-2 rounded-full">
              <User size={20} />
            </div>
            {expanded && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userName || 'User'}</span>
                <span className="text-xs text-muted-foreground">{userEmail || 'user@example.com'}</span>
              </div>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                title="Logout"
              >
                <LogOut size={18} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out? You will need to log in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </aside>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  expanded: boolean;
}

function NavItem({ icon, label, to, expanded }: NavItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
            expanded ? "justify-start" : "justify-center",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-accent hover:text-accent-foreground"
          )
        }
      >
        <span>{icon}</span>
        {expanded && <span className="animate-fade-in">{label}</span>}
      </NavLink>
    </li>
  );
}
