import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Trophy, 
  Users, 
  Shield, 
  Wallet, 
  BarChart3, 
  Bell, 
  Settings, 
  Flame 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Tournaments", href: "/admin/tournaments", icon: Trophy },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Teams", href: "/admin/teams", icon: Shield },
  { name: "Wallet", href: "/admin/wallet", icon: Wallet },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-fire-red rounded-lg flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold">Fire Fight Admin</span>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-800 hover:text-white",
                    isActive && "bg-fire-red text-white hover:bg-fire-red/90"
                  )}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
