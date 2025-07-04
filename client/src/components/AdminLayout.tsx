import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  BarChart, Bell, Flame, Home, Settings, Shield, Trophy, 
  Users, Wallet, FileText, MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Tournaments", href: "/admin/tournaments", icon: Trophy },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Teams", href: "/admin/teams", icon: Shield },
    { name: "Wallet", href: "/admin/wallet", icon: Wallet },
    { name: "Reports", href: "/admin/reports", icon: BarChart },
    { name: "CMS", href: "/admin/cms", icon: FileText },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/admin" && location === "/admin") return true;
    return href !== "/admin" && location.startsWith(href);
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-red-500">Fire Fight Admin</span>
          </div>
          <p className="text-gray-600 mb-6">Access denied. Admin privileges required.</p>
          <Button asChild>
            <Link href="/">Go to Main Site</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold">Fire Fight Admin</span>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition duration-200 ${
                    isActive(item.href) 
                      ? "bg-red-500 text-white" 
                      : "hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {navigation.find(item => isActive(item.href))?.name || "Dashboard"}
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-2 -right-2 w-3 h-3 p-0 bg-red-500"></Badge>
              </Button>
              
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-red-500 text-white text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
