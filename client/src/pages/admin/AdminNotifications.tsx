import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Send, 
  Bell, 
  Users, 
  Trophy, 
  Wallet, 
  AlertCircle,
  CheckCircle,
  Mail,
  MessageSquare
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminNotifications() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "system",
    sendToAll: true,
  });

  // Fetch users for targeting
  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  // Send notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: async (data: any) => {
      const targetUsers = data.sendToAll ? users.map((u: any) => u.id) : selectedUsers;
      
      // Send notification to each user
      const promises = targetUsers.map((userId: number) =>
        apiRequest('POST', '/api/notifications', {
          userId,
          title: data.title,
          message: data.message,
          type: data.type,
          isRead: false,
          data: {},
        })
      );
      
      return Promise.all(promises);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Notification sent successfully",
      });
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    },
  });

  const handleSendNotification = () => {
    if (!notificationForm.title || !notificationForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!notificationForm.sendToAll && selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one user",
        variant: "destructive",
      });
      return;
    }

    sendNotificationMutation.mutate(notificationForm);
  };

  const resetForm = () => {
    setNotificationForm({
      title: "",
      message: "",
      type: "system",
      sendToAll: true,
    });
    setSelectedUsers([]);
  };

  const handleUserSelection = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const notificationTemplates = [
    {
      title: "Tournament Starting Soon",
      message: "Your tournament is starting in 30 minutes. Please join the match room.",
      type: "tournament"
    },
    {
      title: "Withdrawal Processed",
      message: "Your withdrawal request has been processed and funds have been transferred to your account.",
      type: "wallet"
    },
    {
      title: "New Tournament Available",
      message: "A new tournament has been created that matches your interests. Join now!",
      type: "tournament"
    },
    {
      title: "Maintenance Notice",
      message: "The platform will undergo maintenance on [date] from [time] to [time]. Please plan accordingly.",
      type: "system"
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tournament':
        return <Trophy className="w-5 h-5 text-fire-yellow" />;
      case 'wallet':
        return <Wallet className="w-5 h-5 text-fire-blue" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-fire-red" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const activeUsers = users.filter((u: any) => u.isActive);
  const adminUsers = users.filter((u: any) => u.isAdmin);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notification Center</h1>
          <p className="text-gray-600">Send notifications to users and manage communication</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-fire-red hover:bg-fire-red/90">
              <Plus className="w-4 h-4 mr-2" />
              Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Notification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Notification title"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={notificationForm.type} onValueChange={(value) => setNotificationForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="tournament">Tournament</SelectItem>
                      <SelectItem value="wallet">Wallet</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Message *</Label>
                <Textarea
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Notification message"
                  rows={4}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendToAll"
                    checked={notificationForm.sendToAll}
                    onCheckedChange={(checked) => setNotificationForm(prev => ({ ...prev, sendToAll: checked as boolean }))}
                  />
                  <Label htmlFor="sendToAll">Send to all users ({activeUsers.length} users)</Label>
                </div>
                
                {!notificationForm.sendToAll && (
                  <div>
                    <Label>Select Users</Label>
                    <div className="max-h-48 overflow-y-auto border rounded-lg p-4 space-y-2">
                      {users.map((user: any) => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) => handleUserSelection(user.id, checked as boolean)}
                          />
                          <span className="text-sm">{user.fullName} ({user.email})</span>
                          {!user.isActive && (
                            <Badge variant="outline" className="text-xs">Inactive</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleSendNotification}
                  disabled={sendNotificationMutation.isPending}
                  className="flex-1 bg-fire-red hover:bg-fire-red/90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendNotificationMutation.isPending ? "Sending..." : "Send Notification"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-fire-red">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-fire-red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-green-600">{activeUsers.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Users</p>
                <p className="text-3xl font-bold text-fire-yellow">{adminUsers.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-fire-yellow" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Notifications Sent</p>
                <p className="text-3xl font-bold text-fire-blue">--</p>
              </div>
              <Bell className="w-8 h-8 text-fire-blue" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="send" className="w-full">
        <TabsList>
          <TabsTrigger value="send">Send Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Send Options */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Send Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => {
                    setNotificationForm({
                      title: "Platform Maintenance",
                      message: "The platform will undergo scheduled maintenance. Please save your progress.",
                      type: "system",
                      sendToAll: true,
                    });
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Maintenance Notice
                </Button>
                
                <Button
                  onClick={() => {
                    setNotificationForm({
                      title: "New Tournament Alert",
                      message: "A new exciting tournament has been created. Join now and compete for amazing prizes!",
                      type: "tournament",
                      sendToAll: true,
                    });
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Tournament Announcement
                </Button>
                
                <Button
                  onClick={() => {
                    setNotificationForm({
                      title: "Wallet Update",
                      message: "Your wallet has been updated. Check your balance and transaction history.",
                      type: "wallet",
                      sendToAll: false,
                    });
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet Notification
                </Button>
              </CardContent>
            </Card>

            {/* Targeted Messaging */}
            <Card>
              <CardHeader>
                <CardTitle>Targeted Messaging</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">All Active Users</span>
                    <div className="flex items-center space-x-2">
                      <Badge>{activeUsers.length} users</Badge>
                      <Button size="sm" onClick={() => {
                        setNotificationForm(prev => ({ ...prev, sendToAll: true }));
                        setIsCreateModalOpen(true);
                      }}>
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Admin Users Only</span>
                    <div className="flex items-center space-x-2">
                      <Badge>{adminUsers.length} users</Badge>
                      <Button size="sm" onClick={() => {
                        setSelectedUsers(adminUsers.map((u: any) => u.id));
                        setNotificationForm(prev => ({ ...prev, sendToAll: false }));
                        setIsCreateModalOpen(true);
                      }}>
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Custom Selection</span>
                    <div className="flex items-center space-x-2">
                      <Badge>Choose users</Badge>
                      <Button size="sm" onClick={() => {
                        setNotificationForm(prev => ({ ...prev, sendToAll: false }));
                        setIsCreateModalOpen(true);
                      }}>
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notificationTemplates.map((template, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      {getNotificationIcon(template.type)}
                      <h3 className="font-semibold">{template.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{template.message}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {template.type}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => {
                          setNotificationForm({
                            title: template.title,
                            message: template.message,
                            type: template.type,
                            sendToAll: true,
                          });
                          setIsCreateModalOpen(true);
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notification history</h3>
                <p>Sent notifications will appear here for tracking and analytics.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
