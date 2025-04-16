
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell } from 'lucide-react';

const AnnouncementManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcement Management</CardTitle>
        <CardDescription>
          Create and manage family announcements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-20 text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4" />
          <p>Announcement management features coming soon!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementManagement;
