import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { signInWithOtp, verifyOtp } from '@/services/api';
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Key, Loader, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const verifySchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  token: z.string().min(1, { message: "Please enter the OTP code." }),
  name: z.string().optional(),
  phone_number: z.string().optional()
}).refine((data) => {
  // Only require name if user is new
  if (window.isNewUser) {
    return !!data.name && data.name.length >= 2;
  }
  return true;
}, {
  message: "Name is required and must be at least 2 characters.",
  path: ["name"]
});

// Add this prop to your component
interface CreateUserProps {
  onAuthSuccess?: () => void;
}

const CreateUser = ({ onAuthSuccess }: CreateUserProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });

  const verifyForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { email: "", token: "", name: "", phone_number: "" },
  });

  const onRequestLoginOtp = async () => {
    const values = loginForm.getValues();
    setIsLoading(true);
    try {
      const response = await signInWithOtp(values.email);
      setCurrentEmail(values.email);
      setIsVerifying(true);
      setIsNewUser(response.is_new_user || false);
      window.isNewUser = response.is_new_user || false;
      
      // Clear the token field completely to ensure it's empty
      verifyForm.setValue("email", values.email);
      verifyForm.setValue("token", "");
      verifyForm.setValue("name", "");
      verifyForm.setValue("phone_number", "");

      toast({
        title: "OTP sent",
        description: response.message || "Please check your email for OTP",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP";
      toast({
        title: "Failed to send OTP",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onVerify = async (values: z.infer<typeof verifySchema>) => {
    setIsLoading(true);
    try {
      const dataToSend = {
        email: currentEmail || values.email,
        token: values.token,
        name: isNewUser ? (values.name || '') : '',
        phone_number: isNewUser ? (values.phone_number || '') : ''
      };

      const response = await verifyOtp(dataToSend);

      localStorage.setItem('currentUserId', response.user.id);
      localStorage.setItem('currentUserName', response.user.name);
      localStorage.setItem('currentUserEmail', response.user.email);

      // Call onAuthSuccess to update authentication state
      if (onAuthSuccess) {
        onAuthSuccess();
      }

      toast({
        title: "Verification successful",
        description: response.message || "Email verified successfully",
      });

      // Navigate to dashboard instead of documents page
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to verify OTP";
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
            <Bot className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent mb-2">
            FlexiRAG
          </h1>
          <p className="text-muted-foreground">Your AI-powered document assistant</p>
        </div>

        <Card className="border-2 shadow-lg backdrop-blur-sm bg-background/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isVerifying ? (
                <>
                  <Key className="w-5 h-5 text-primary" />
                  Verify OTP
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 text-primary" />
                  Sign In
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isVerifying ? (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onRequestLoginOtp)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10 transition-all duration-200 border-muted-foreground/20 hover:border-primary/50 focus:border-primary"
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? "Sending OTP..." : "Get OTP"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...verifyForm}>
                <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-4">
                  <FormField
                    control={verifyForm.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OTP Code</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Enter OTP"
                              className="pl-10 text-center tracking-[0.5em] font-mono transition-all duration-200"
                            />
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isNewUser && (
                    <FormField
                      control={verifyForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Your name"
                              className="transition-all duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="space-y-2">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Key className="w-4 h-4 mr-2" />
                      )}
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full hover:bg-primary/5"
                      onClick={() => setIsVerifying(false)}
                      disabled={isLoading}
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default CreateUser;

// Add TypeScript declaration for the window object
declare global {
  interface Window {
    isNewUser: boolean;
  }
}
