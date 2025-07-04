import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { 
  Flame, 
  Bell, 
  Menu, 
  X, 
  Wallet, 
  Trophy, 
  Users, 
  BarChart3,
  Gift,
  HelpCircle,
  Settings,
  LogOut
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: null },
    { name: "Tournaments", href: "/tournaments", icon: Trophy },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Leaderboard", href: "/leaderboard", icon: BarChart3 },
  ];

  if (!user) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-fire-red to-fire-yellow rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold fire-red">Fire Fight</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-fire-red hover:bg-fire-red/90">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-fire-red to-fire-yellow rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold fire-red">Fire Fight</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-gray-700 hover:text-fire-red transition duration-200 ${
                  location === item.href ? 'text-fire-red font-semibold' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wallet Balance */}
            <Link href="/wallet">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                <Wallet className="w-4 h-4 text-fire-yellow" />
                <span className="text-sm font-semibold">{formatCurrency(user.walletBalance)}</span>
              </div>
            </Link>
            
            {/* Notifications */}
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-3 h-3 p-0 bg-fire-red"></Badge>
              </Button>
            </Link>
            
            {/* User Menu */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="p-0">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-fire-red text-white">
                      {user.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="end">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-fire-red text-white">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">{user.fullName}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link href="/profile">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Link href="/wallet">
                    <Button variant="ghost" className="w-full justify-start">
                      <Wallet className="w-4 h-4 mr-2" />
                      Wallet
                    </Button>
                  </Link>
                  <Link href="/referral">
                    <Button variant="ghost" className="w-full justify-start">
                      <Gift className="w-4 h-4 mr-2" />
                      Referral
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button variant="ghost" className="w-full justify-start">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help
                    </Button>
                  </Link>
                  {user.isAdmin && (
                    <>
                      <Separator className="my-2" />
                      <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Button>
                      </Link>
                    </>
                  )}
                  <Separator className="my-2" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-2 text-gray-700 hover:text-fire-red transition duration-200 ${
                    location === item.href ? 'text-fire-red font-semibold' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 py-2 border-t">
                <Link href="/wallet" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <Wallet className="w-4 h-4 text-fire-yellow" />
                    <span className="text-sm font-semibold">{formatCurrency(user.walletBalance)}</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
