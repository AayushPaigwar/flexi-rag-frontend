import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bot, Sparkle, Sprout, Stars } from "lucide-react";
import { useEffect, useState } from "react";

interface ComingSoonProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function ComingSoon({ title, subtitle, className }: ComingSoonProps) {
  const [animationIndex, setAnimationIndex] = useState(0);
  const icons = [Bot, Sparkle, Sprout, Stars];
  const Icon = icons[animationIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationIndex((prev) => (prev + 1) % icons.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn("container max-w-7xl mx-auto py-6 px-4", className)}>
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/20">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-black/10" />
        <CardContent className="pt-20 pb-20 text-center relative">
          <div className="mb-6 inline-block p-4 bg-background/95 rounded-full shadow-lg animate-bounce">
            <Icon size={48} className="text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent animate-gradient">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <div className="animate-float delay-100">🚀</div>
            <div className="animate-float delay-200">✨</div>
            <div className="animate-float delay-300">🎯</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
