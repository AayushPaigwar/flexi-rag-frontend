import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { createUser, signInWithOtp, verifyOtp } from '@/services/api';
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Mail, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone_number: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const verifySchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  token: z.string().min(1, { message: "Please enter the OTP code." }),
});

const CreateUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", phone_number: "" },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });

  const verifyForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { email: "", token: "" },
  });

  const onSignup = async (values: z.infer<typeof signupSchema>) => {
    try {
      const response = await createUser({
        name: values.name,
        email: values.email,
        phone_number: values.phone_number,
      });
      setCurrentEmail(values.email);
      setIsVerifying(true);
      toast({
        title: "Sign up successful",
        description: response.message || "Please check your email for OTP verification",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create user";
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      const response = await signInWithOtp(values.email);
      setCurrentEmail(values.email);
      setIsVerifying(true);
      toast({
        title: "OTP sent",
        description: response.message || "Please check your email for OTP",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const onVerify = async (values: z.infer<typeof verifySchema>) => {
    try {
      const response = await verifyOtp(values.email, values.token);
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
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>FlexiRAG Platform</CardTitle>
          <CardDescription>
            Create a profile or login to start using the FlexiRAG platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isVerifying ? (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
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
                    <Button type="submit" className="w-full">
                      <Mail className="mr-2 h-4 w-4" /> Login with Email
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-6">
                    <FormField
                      control={signupForm.control}
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
                      control={signupForm.control}
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
                    <FormField
                      control={signupForm.control}
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
                    <Button type="submit" className="w-full">
                      <UserPlus className="mr-2 h-4 w-4" /> Create Profile
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          ) : (
            <Form {...verifyForm}>
              <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-6">
                <FormField
                  control={verifyForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="john@example.com" 
                          type="email" 
                          {...field} 
                          defaultValue={currentEmail}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button type="submit" className="w-full">
                  <Key className="mr-2 h-4 w-4" /> Verify OTP
                </Button>
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