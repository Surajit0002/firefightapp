
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CMS() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="text-muted-foreground">
          Manage website content and settings
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>CMS Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Content management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
