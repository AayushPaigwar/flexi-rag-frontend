import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "@/lib/router"; // Import our custom router
import { cn } from "@/lib/utils";
import { FaXTwitter } from "react-icons/fa6";

import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Github,
  Home,
  Key,
  Linkedin,
  LogOut,
  Server,
  Settings,
  Twitter,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter(); // Use our custom router
  const { toast } = useToast();

  useEffect(() => {
    const email = localStorage.getItem("currentUserEmail");
    const name = localStorage.getItem("currentUserName");
    const id = localStorage.getItem("currentUserId");

    if (email) setUserEmail(email);
    if (name) setUserName(name);
    if (id) setUserId(id);
  }, []);

  // Update the handleLogout function to use router
  const handleLogout = async () => {
    try {
      if (userEmail) {
        console.log("Logging out user:", userEmail);

        // Clear ALL local storage completely
        localStorage.clear();

        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });

        // Force a complete page reload to reset all React state
        window.location.replace("/");
      } else {
        console.error("No user email found for logout");
        localStorage.clear();
        window.location.replace("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      window.location.replace("/");

      toast({
        title: "Logout completed",
        description: "You have been logged out of your account.",
      });
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        expanded ? "w-64" : "w-20",
        "transition-all duration-300 ease-in-out shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b bg-blue-50">
        {expanded ? (
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            FlexiRAG
          </h1>
        ) : (
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            FR
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="ml-auto hover:bg-primary/10"
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {/* Update each button with enhanced hover and active states */}
          <Button
            variant={router.isActive("/dashboard") ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start mb-1 transition-colors",
              expanded ? "" : "justify-center",
              router.isActive("/dashboard")
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                : "hover:bg-primary/5"
            )}
            onClick={() => router.push("/dashboard")}
          >
            <Home className={cn("h-5 w-5", expanded ? "mr-2" : "")} />
            {expanded && <span>Dashboard</span>}
          </Button>

          {/* Apply similar styling to other navigation buttons */}
          <Button
            variant={router.isActive("/documents") ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start mb-1",
              expanded ? "" : "justify-center",
              router.isActive("/documents")
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                : "hover:bg-primary/5"
            )}
            onClick={() => router.push(`/documents/${userId}`)}
          >
            <FileText className={cn("h-5 w-5", expanded ? "mr-2" : "")} />
            {expanded && <span>Documents</span>}
          </Button>

          <Button
            variant={router.isActive("/upload") ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start mb-1",
              expanded ? "" : "justify-center",
              router.isActive("/upload")
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                : "hover:bg-primary/5"
            )}
            onClick={() => router.push("/upload")}
          >
            <Upload className={cn("h-5 w-5", expanded ? "mr-2" : "")} />
            {expanded && <span>Upload</span>}
          </Button>

          <Button
            variant={router.isActive("/deployments") ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start mb-1",
              expanded ? "" : "justify-center",
              router.isActive("/deployments")
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                : "hover:bg-primary/5"
            )}
            onClick={() => router.push("/deployments")}
          >
            <Server className={cn("h-5 w-5", expanded ? "mr-2" : "")} />
            {expanded && <span>Deployments</span>}
          </Button>

          <Button
            variant={router.isActive("/api") ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start mb-1",
              expanded ? "" : "justify-center",
              router.isActive("/api")
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                : "hover:bg-primary/5"
            )}
            onClick={() => router.push("/api")}
          >
            <Key className={cn("h-5 w-5", expanded ? "mr-2" : "")} />
            {expanded && <span>API Access</span>}
          </Button>
        </nav>
      </div>

      <div className="p-4 border-t bg-muted/20">
        <Button
          variant={router.isActive("/settings") ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start mb-4",
            expanded ? "" : "justify-center",
            router.isActive("/settings")
              ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
              : "hover:bg-primary/5"
          )}
          onClick={() => router.push("/settings")}
        >
          <Settings className={cn("h-5 w-5", expanded ? "mr-2" : "")} />
          {expanded && <span>Settings</span>}
        </Button>

        <div
          className={`flex items-center ${
            expanded ? "justify-between" : "justify-center"
          } mb-2`}
        >
          {expanded && (
            <div className="truncate">
              <p className="text-sm font-medium truncate">
                {userName || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userEmail}
              </p>
            </div>
          )}

          <AlertDialog
            open={showLogoutDialog}
            onOpenChange={setShowLogoutDialog}
          >
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" title="Logout">
                <LogOut size={18} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to logout?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You will be logged out of your account and redirected to the
                  login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* About Developer Box */}
      <div
        className={cn(
          "m-2.5 mb-4 p-3 rounded-lg border border-blue-200 bg-blue-50",
          !expanded && "p-2"
        )}
      >
        {expanded ? (
          <>
            <h3 className="font-medium text-blue-700 mb-2">Developed By</h3>
            <p className="text-sm text-blue-600 mb-3">Aayush Paigwar</p>
            <div className="space-y-2">
              <a
                href="https://linkedin.com/in/aayush-paigwar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/aayushpaigwar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Github className="h-4 w-4 mr-2" />
                <span>GitHub</span>
              </a>
              <a
                href="https://twitter.com/aayush27_11"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <FaXTwitter className="h-4 w-4 mr-2" />

                <span>Twitter</span>
              </a>
              {/* <a
                href="mailto:aayushpaigwar@gmail.com"
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Mail className="h-4 w-4 mr-2" />
                <span>Contact</span>
              </a> */}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Linkedin
              className="h-5 w-5 text-blue-600 cursor-pointer"
              onClick={() =>
                window.open("https://linkedin.com/in/aayush-paigwar", "_blank")
              }
            />
            <Github
              className="h-5 w-5 text-blue-600 cursor-pointer"
              onClick={() =>
                window.open("https://github.com/aayushpaigwar", "_blank")
              }
            />
            <Twitter
              className="h-5 w-5 text-blue-600 cursor-pointer"
              onClick={() =>
                window.open("https://twitter.com/aayush27_11", "_blank")
              }
            />
            {/* <Mail
              className="h-5 w-5 text-blue-600 cursor-pointer"
              onClick={() => window.open("mailto:aayushpaigwar@gmail.com")}
            /> */}
          </div>
        )}
      </div>
    </div>
  );
}
