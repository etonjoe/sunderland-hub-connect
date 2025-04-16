
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Sample data
const RECENT_ACTIVITIES = [
  { id: '1', action: 'New forum post', user: 'Premium User', timestamp: '2023-05-20 10:30 AM', details: 'Posted in General Discussion' },
  { id: '2', action: 'Resource uploaded', user: 'Admin User', timestamp: '2023-05-19 3:45 PM', details: 'Family Tree 2023' },
  { id: '3', action: 'New member joined', user: 'John Doe', timestamp: '2023-05-18 9:15 AM', details: 'Basic membership' },
  { id: '4', action: 'Premium upgrade', user: 'Jane Smith', timestamp: '2023-05-17 1:20 PM', details: 'Yearly subscription' },
  { id: '5', action: 'New announcement', user: 'Admin User', timestamp: '2023-05-16 11:05 AM', details: 'Annual Family Reunion' },
];

const ActivityLog = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Track user actions across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RECENT_ACTIVITIES.map(activity => (
              <TableRow key={activity.id}>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.user}</TableCell>
                <TableCell>{activity.details}</TableCell>
                <TableCell>{activity.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Previous</Button>
        <Button variant="outline">Next</Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityLog;
