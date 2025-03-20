import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { signInWithOtp, verifyOtp } from '@/services/api';
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Loader, Mail } from 'lucide-react';
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

const CreateUser = () => {
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
      // Add this line to make isNewUser available to schema validation
      window.isNewUser = response.is_new_user || false;
      
      verifyForm.reset({
        email: values.email,
        token: "",
        name: "",
        phone_number: ""
      });

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

      toast({
        title: "Verification successful",
        description: response.message || "Email verified successfully",
      });

      navigate(`/documents/${response.user.id}`);
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
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>FlexiRAG: Make your Custom RAG Agents</CardTitle>
          <CardDescription>
            {!isVerifying 
              ? "Sign in to start using the FlexiRAG platform"
              : isNewUser 
                ? "Complete your registration"
                : "Enter verification code"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isVerifying ? (
            <Form {...loginForm}>
              <form className="space-y-6">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="button" 
                  className="w-full" 
                  onClick={onRequestLoginOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Sending OTP..." : "Send OTP to Email"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...verifyForm}>
              <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-6">
                <div className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email" 
                    value={currentEmail}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <FormField
                  control={verifyForm.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter OTP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isNewUser && (
                  <>
                    <FormField
                      control={verifyForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={verifyForm.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsVerifying(false);
                      setIsNewUser(false);
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Key className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? "Verifying..." : isNewUser ? "Complete Registration" : "Verify OTP"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          FlexiRAG - Retrieve information from your documents
        </CardFooter>
      </Card>
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
