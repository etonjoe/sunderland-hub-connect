
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Report {
  id: string;
  content_type: string;
  content_id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  reporter_id: string;
}

const ReportsManagement = () => {
  const { data: reports = [], refetch } = useQuery({
    queryKey: ['content-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Failed to fetch reports');
        return [];
      }
      
      return data as Report[];
    }
  });

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    const { error } = await supabase
      .from('content_reports')
      .update({ 
        status: newStatus,
        resolved_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', reportId);

    if (error) {
      toast.error('Failed to update report status');
      return;
    }

    toast.success('Report status updated successfully');
    refetch();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      case 'under_review':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Reports</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.title}</TableCell>
              <TableCell className="capitalize">{report.content_type.replace('_', ' ')}</TableCell>
              <TableCell className="max-w-md truncate">{report.description}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(report.status)}>
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {report.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => updateReportStatus(report.id, 'under_review')}
                      >
                        Review
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateReportStatus(report.id, 'resolved')}
                      >
                        Resolve
                      </Button>
                    </>
                  )}
                  {report.status === 'under_review' && (
                    <Button 
                      size="sm"
                      onClick={() => updateReportStatus(report.id, 'resolved')}
                    >
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsManagement;
