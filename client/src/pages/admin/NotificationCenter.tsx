
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notification Center</h1>
        <p className="text-muted-foreground">
          Manage system notifications and alerts
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Notification management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
