import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signInWithOtp, verifyOtp } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Key, Loader, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const verifySchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    token: z.string().min(1, { message: "Please enter the OTP code." }),
    name: z.string().optional(),
    phone_number: z.string().optional(),
  })
  .refine(
    (data) => {
      // Only require name if user is new
      if (window.isNewUser) {
        return !!data.name && data.name.length >= 2;
      }
      return true;
    },
    {
      message: "Name is required and must be at least 2 characters.",
      path: ["name"],
    }
  );

// Add this prop to your component
interface CreateUserProps {
  onAuthSuccess?: () => void;
}

const CreateUser = ({ onAuthSuccess }: CreateUserProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
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
        phone_number: "",
      });

      toast({
        title: "OTP sent",
        description: response.message || "Please check your email for OTP",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send OTP";
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
        name: isNewUser ? values.name || "" : "",
        phone_number: isNewUser ? values.phone_number || "" : "",
      };

      const response = await verifyOtp(dataToSend);

      localStorage.setItem("currentUserId", response.user.id);
      localStorage.setItem("currentUserName", response.user.name);
      localStorage.setItem("currentUserEmail", response.user.email);

      // Call onAuthSuccess to update authentication state
      if (onAuthSuccess) {
        onAuthSuccess();
      }

      toast({
        title: "Verification successful",
        description: response.message || "Email verified successfully",
      });

      // Navigate to dashboard instead of documents page
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to verify OTP";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="max-w-md w-full shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-blue-100 to-blue-200 text-white p-8">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-blue-300/20 flex items-center justify-center border border-gray-300">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-blue-600">
            FlexiRAG
          </CardTitle>
          <CardDescription className="text-white/80 text-center mt-2 text-blue-600">
            {!isVerifying
              ? "Sign in to start using the FlexiRAG platform"
              : isNewUser
              ? "Complete your registration"
              : "Enter verification code"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {!isVerifying ? (
            <Form {...loginForm}>
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  onRequestLoginOtp();
                }}
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          type="email"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-5 w-5" />
                  )}
                  {isLoading ? "Sending OTP..." : "Send OTP to Email"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...verifyForm}>
              <form
                onSubmit={verifyForm.handleSubmit(onVerify)}
                className="space-y-6"
              >
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
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Key className="mr-2 h-4 w-4" />
                    )}
                    {isLoading
                      ? "Verifying..."
                      : isNewUser
                      ? "Complete Registration"
                      : "Verify OTP"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground p-6 border-t">
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
