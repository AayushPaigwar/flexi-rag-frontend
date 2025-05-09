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
import {
  ArrowLeft,
  FileText,
  Key,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Mouse position tracking
    let mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 150,
    };

    window.addEventListener("mousemove", function (event) {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    // Particle settings
    const particlesArray: Particle[] = [];
    const particleCount = 80; // Increased particle count
    const colorPalette = [
      { r: 100, g: 120, b: 255 }, // Blue
      { r: 147, g: 112, b: 219 }, // Purple
      { r: 75, g: 0, b: 130 }, // Indigo
      { r: 106, g: 90, b: 205 }, // Slate blue
      { r: 138, g: 43, b: 226 }, // Blue violet
    ];

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      baseSize: number;
      speedX: number;
      speedY: number;
      color: string;
      colorObj: { r: number; g: number; b: number };
      density: number;
      originalX: number;
      originalY: number;
      angle: number;
      velocity: number;
      pulseDirection: boolean;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originalX = this.x;
        this.originalY = this.y;
        this.baseSize = Math.random() * 3 + 1;
        this.size = this.baseSize;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.colorObj =
          colorPalette[Math.floor(Math.random() * colorPalette.length)];
        this.color = `rgba(${this.colorObj.r}, ${this.colorObj.g}, ${
          this.colorObj.b
        }, ${0.4 + Math.random() * 0.5})`;
        this.density = Math.random() * 20 + 5;
        this.angle = Math.random() * 360;
        this.velocity = 0.05;
        this.pulseDirection = Math.random() > 0.5;
      }

      update() {
        // Mouse interaction
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;

          // Maximum distance, past which the force is 0
          const maxDistance = 100;
          let force = (maxDistance - distance) / maxDistance;

          // If we're close enough to be affected
          if (distance < maxDistance) {
            this.x -= forceDirectionX * force * this.density;
            this.y -= forceDirectionY * force * this.density;
          } else {
            // Gentle return to original position when not affected by mouse
            if (this.x !== this.originalX) {
              let dx = this.x - this.originalX;
              this.x -= dx / 50;
            }
            if (this.y !== this.originalY) {
              let dy = this.y - this.originalY;
              this.y -= dy / 50;
            }
          }
        }

        // Normal movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Boundary check
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;

        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;

        // Pulse effect
        if (this.pulseDirection) {
          this.size += 0.03;
          if (this.size > this.baseSize + 1) {
            this.pulseDirection = false;
          }
        } else {
          this.size -= 0.03;
          if (this.size < this.baseSize - 0.5) {
            this.pulseDirection = true;
          }
        }

        // Subtle circular movement
        this.angle += this.velocity;
        this.x += Math.cos(this.angle) * 0.2;
        this.y += Math.sin(this.angle) * 0.2;
      }

      draw() {
        if (!ctx) return;

        // Create gradient for each particle
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 2
        );

        gradient.addColorStop(
          0,
          `rgba(${this.colorObj.r}, ${this.colorObj.g}, ${this.colorObj.b}, 0.8)`
        );
        gradient.addColorStop(
          1,
          `rgba(${this.colorObj.r}, ${this.colorObj.g}, ${this.colorObj.b}, 0)`
        );

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }

      // Draw connections
      connectParticles();

      requestAnimationFrame(animate);
    };

    // Connect particles with lines if they're close enough
    const connectParticles = () => {
      if (!ctx) return;
      const maxDistance = 120;

      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            // Create gradient for the connection line
            const opacity = 1 - distance / maxDistance;
            const gradient = ctx.createLinearGradient(
              particlesArray[a].x,
              particlesArray[a].y,
              particlesArray[b].x,
              particlesArray[b].y
            );

            const colorA = particlesArray[a].colorObj;
            const colorB = particlesArray[b].colorObj;

            gradient.addColorStop(
              0,
              `rgba(${colorA.r}, ${colorA.g}, ${colorA.b}, ${opacity * 0.8})`
            );
            gradient.addColorStop(
              1,
              `rgba(${colorB.r}, ${colorB.g}, ${colorB.b}, ${opacity * 0.8})`
            );

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    animate();

    // Add touch support for mobile devices
    window.addEventListener("touchmove", function (event) {
      if (event.touches.length > 0) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
      }
    });

    window.addEventListener("touchend", function () {
      mouse.x = null;
      mouse.y = null;
    });

    // Reset mouse position when mouse leaves canvas
    window.addEventListener("mouseleave", function () {
      mouse.x = null;
      mouse.y = null;
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
      });
      window.removeEventListener("touchmove", function (event) {
        if (event.touches.length > 0) {
          mouse.x = event.touches[0].clientX;
          mouse.y = event.touches[0].clientY;
        }
      });
      window.removeEventListener("touchend", function () {
        mouse.x = null;
        mouse.y = null;
      });
      window.removeEventListener("mouseleave", function () {
        mouse.x = null;
        mouse.y = null;
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50 p-4 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center shadow-xl">
          <FileText className="h-10 w-10 text-white" />
        </div>

        <Card className="mt-12 border-0 shadow-2xl overflow-hidden bg-white/90 backdrop-blur-sm relative z-10">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              FlexiRAG
            </CardTitle>
            <CardDescription className="text-center text-gray-600 mt-2">
              {!isVerifying
                ? "Sign in to start using the FlexiRAG platform"
                : isNewUser
                ? "Complete your registration"
                : "Enter verification code"}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6 pt-4">
            {!isVerifying ? (
              <Form {...loginForm}>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onRequestLoginOtp();
                  }}
                >
                  <div className="bg-indigo-50 p-6 rounded-xl">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <Mail className="h-4 w-4 text-indigo-500 mr-2" />
                            <FormLabel className="text-indigo-700 font-medium">
                              Email Address
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Input
                              placeholder="john@example.com"
                              type="email"
                              className="h-12 rounded-lg border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <LockKeyhole className="mr-2 h-5 w-5" />
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
                  <div className="space-y-6 bg-indigo-50 p-6 rounded-xl">
                    <div className="space-y-2">
                      <div className="flex items-center mb-1">
                        <Mail className="h-4 w-4 text-indigo-500 mr-2" />
                        <FormLabel className="text-indigo-700 font-medium">
                          Email
                        </FormLabel>
                      </div>
                      <Input
                        type="email"
                        value={currentEmail}
                        disabled
                        className="h-10 bg-indigo-100/60 border-none text-gray-500"
                      />
                    </div>

                    <FormField
                      control={verifyForm.control}
                      name="token"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-1">
                            <Key className="h-4 w-4 text-indigo-500 mr-2" />
                            <FormLabel className="text-indigo-700 font-medium">
                              OTP Code
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Input
                              placeholder="Enter OTP"
                              className="h-12 rounded-lg border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm mt-1" />
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
                              <div className="flex items-center mb-1">
                                <FileText className="h-4 w-4 text-indigo-500 mr-2" />
                                <FormLabel className="text-indigo-700 font-medium">
                                  Full Name
                                </FormLabel>
                              </div>
                              <FormControl>
                                <Input
                                  placeholder="John Doe"
                                  className="h-12 rounded-lg border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm mt-1" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={verifyForm.control}
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center mb-1">
                                <Mail className="h-4 w-4 text-indigo-500 mr-2" />
                                <FormLabel className="text-indigo-700 font-medium">
                                  Phone Number (Optional)
                                </FormLabel>
                              </div>
                              <FormControl>
                                <Input
                                  placeholder="+1234567890"
                                  className="h-12 rounded-lg border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm mt-1" />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsVerifying(false);
                        setIsNewUser(false);
                      }}
                      className="flex-1 h-12 border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-lg font-medium transition-all"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

          <CardFooter className="flex justify-center text-sm text-gray-500 p-6 border-t bg-gray-50/50">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-indigo-400" />
              <span>FlexiRAG - Retrieve information from your documents</span>
            </div>
          </CardFooter>
        </Card>
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
