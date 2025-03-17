
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createUser } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone_number: z.string().optional(),
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
      navigate(`/documents/${user.id}`);
    } catch (error) {
      toast({
        title: "Failed to create user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create User Profile</CardTitle>
          <CardDescription>
            Create a profile to start using the FlexiRAG platform
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                Create Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUser;
