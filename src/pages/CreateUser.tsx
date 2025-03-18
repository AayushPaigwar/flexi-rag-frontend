
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createUser } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Mail, UserPlus } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone_number: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  })
});

const CreateUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
    },
  });
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const user = await createUser(values);
      toast({
        title: "User created successfully",
        description: `Welcome, ${user.name}!`,
      });
      // Store user ID in local storage for later use
      localStorage.setItem('currentUserId', user.id);
      localStorage.setItem('currentUserName', user.name);
      localStorage.setItem('currentUserEmail', user.email);
      navigate(`/documents/${user.id}`);
    } catch (error) {
      console.error("Error creating user:", error);
      // Extract error message from API response if available
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error instanceof Response) {
        errorMessage = `Server error: ${error.status}`;
      }
      
      toast({
        title: "Failed to create user",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    // This is a temporary login function that uses hardcoded user id
    // In a real application, you would verify the email against a database
    try {
      const email = values.email;
      // For demo purposes, we'll store this in localStorage
      const userId = localStorage.getItem('demoUserId') || "12345-demo-user-id";
      const userName = email.split('@')[0];
      
      localStorage.setItem('currentUserId', userId);
      localStorage.setItem('currentUserEmail', email);
      localStorage.setItem('currentUserName', userName);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userName}!`,
      });
      
      navigate(`/documents/${userId}`);
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "There was an error logging in";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Login failed",
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          FlexiRAG - Retrieve information from your documents
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateUser;
