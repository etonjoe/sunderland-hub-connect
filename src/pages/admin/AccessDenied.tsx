
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AccessDenied = () => {
  return (
    <div className="container py-10 animate-fade-in">
      <div className="max-w-2xl mx-auto text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-6">
          You do not have permission to access the admin area.
          This section is restricted to administrators only.
        </p>
        <Button asChild>
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default AccessDenied;
