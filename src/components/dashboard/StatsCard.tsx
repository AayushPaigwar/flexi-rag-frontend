
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  className?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon, 
  className,
  trend
}: StatsCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl p-6 shadow-sm border border-border/40 transition-all duration-200 hover:shadow-md animate-scale-in",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-1">
              <span className={cn(
                "text-xs font-medium",
                trend.positive ? "text-green-600" : "text-red-600"
              )}>
                {trend.positive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last week</span>
            </div>
          )}
          
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
