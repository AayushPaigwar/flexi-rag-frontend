
import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { mockCurrentUser } from '@/data/mock-data';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className={cn("flex-1 overflow-auto p-6 animate-fade-in", className)}>
        <div className="text-sm text-muted-foreground mb-2">
          Logged in as: {mockCurrentUser.name} ({mockCurrentUser.email})
        </div>
        {children}
      </main>
    </div>
  );
}
