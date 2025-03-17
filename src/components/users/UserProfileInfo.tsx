
import React from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCurrentUser } from '@/data/mock-data';

interface UserProfileInfoProps {
  className?: string;
}

export function UserProfileInfo({ className }: UserProfileInfoProps) {
  const user = mockCurrentUser;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <User className="mr-3 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Name</p>
            <p className="text-sm text-muted-foreground">{user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Mail className="mr-3 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        
        {user.phone_number && (
          <div className="flex items-center">
            <Phone className="mr-3 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{user.phone_number}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
