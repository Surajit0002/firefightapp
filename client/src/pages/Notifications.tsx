import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Trophy, 
  Wallet, 
  Users, 
  AlertCircle, 
  Check, 
  Trash2,
  Filter,
  Bookmark
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Notifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  // Fetch user notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ["/api/users", user?.id, "notifications"],
    enabled: !!user?.id,
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await apiRequest('PUT', `/api/notifications/${notificationId}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "notifications"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tournament':
        return <Trophy className="w-5 h-5 text-fire-yellow" />;
      case 'wallet':
        return <Wallet className="w-5 h-5 text-fire-blue" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-fire-red" />;
      case 'referral':
        return <Users className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-gray-50';
    
    switch (type) {
      case 'tournament':
        return 'bg-yellow-50 border-l-4 border-fire-yellow';
      case 'wallet':
        return 'bg-blue-50 border-l-4 border-fire-blue';
      case 'system':
        return 'bg-red-50 border-l-4 border-fire-red';
      case 'referral':
        return 'bg-green-50 border-l-4 border-green-500';
      default:
        return 'bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter((notification: any) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    if (filter !== "all") return notification.type === filter;
    return true;
  });

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleMarkAsRead = (notificationId: number) => {
    markAsReadMutation.mutate(notificationId);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Notifications</h1>
        <p className="text-gray-600">Please login to view your notifications.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-gray-600">You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
          )}
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-fire-red hover:bg-fire-red/90" : ""}
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className={filter === "unread" ? "bg-fire-red hover:bg-fire-red/90" : ""}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === "tournament" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("tournament")}
            className={filter === "tournament" ? "bg-fire-red hover:bg-fire-red/90" : ""}
          >
            Tournaments
          </Button>
          <Button
            variant={filter === "wallet" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("wallet")}
            className={filter === "wallet" ? "bg-fire-red hover:bg-fire-red/90" : ""}
          >
            Wallet
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notificationsLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="w-48 h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="w-full h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="w-24 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {filter === "all" ? "No notifications yet" : `No ${filter} notifications`}
              </h3>
              <p className="text-gray-600">
                {filter === "all" 
                  ? "You'll see your notifications here when you have any." 
                  : `No ${filter} notifications to show.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification: any) => (
              <Card key={notification.id} className={`${getNotificationBgColor(notification.type, notification.isRead)} transition-all hover:shadow-md`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.createdAt)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {notification.type}
                            </Badge>
                            {!notification.isRead && (
                              <Badge className="bg-fire-red text-white text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={markAsReadMutation.isPending}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {notifications.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-fire-red">{notifications.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">{unreadCount}</div>
              <div className="text-sm text-gray-600">Unread</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-fire-yellow">
                {notifications.filter((n: any) => n.type === 'tournament').length}
              </div>
              <div className="text-sm text-gray-600">Tournament</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-fire-blue">
                {notifications.filter((n: any) => n.type === 'wallet').length}
              </div>
              <div className="text-sm text-gray-600">Wallet</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
