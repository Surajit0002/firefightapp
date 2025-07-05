import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Bell, Coins, Flame, Menu, X, Home, Trophy, Users, Crown, 
  Gift, HelpCircle, Wallet, User, Search, MessageCircle,
  Settings, LogOut, Gamepad2, Zap, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Notification } from "@shared/schema";
import Flag from "react-world-flags";
import { countries } from "@/lib/countries";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ["/api/users", user?.id, "notifications"],
    enabled: !!user?.id,
  });

  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  const country = countries.find(c => c.code === user?.country);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Tournaments", href: "/tournaments", icon: Trophy },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Leaderboard", href: "/leaderboard", icon: Crown },
    { name: "Referral", href: "/referral", icon: Gift },
    { name: "Help", href: "/help", icon: HelpCircle },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    return href !== "/" && location.startsWith(href);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-red-500">Fire Fight</span>
          </div>
          <p className="text-gray-600 mb-6">Please log in to continue</p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-red-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Enhanced Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Flame className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Fire Fight
                </span>
                <span className="text-xs text-gray-500 -mt-1">Tournament Platform</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search tournaments, teams, players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border-gray-200 focus:bg-white focus:border-red-300 rounded-xl"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActive(item.href) 
                        ? "bg-red-100 text-red-600 font-semibold shadow-sm" 
                        : "text-gray-600 hover:text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Enhanced User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Wallet Balance */}
              <Link 
                href="/wallet" 
                className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-xl hover:from-green-200 hover:to-emerald-200 transition-all duration-200 border border-green-200 shadow-sm"
              >
                <Wallet className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-green-700">₹{user.walletBalance}</span>
              </Link>
              
              {/* Bonus Coins Display */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-3 py-2 rounded-xl border border-yellow-200 shadow-sm">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-bold text-yellow-700">{user.bonusCoins || 0}</span>
              </div>

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative p-2">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-3 border-b">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <p className="text-sm text-gray-500">{unreadCount} unread</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications?.slice(0, 5).map((notification) => (
                      <DropdownMenuItem key={notification.id} className="p-3 border-b last:border-b-0">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-300' : 'bg-red-500'}`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500 truncate">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.createdAt || '').toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    )) || (
                      <div className="p-6 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-xl">
                    <Avatar className="w-10 h-10 border-2 border-red-200">
                      <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-800">{user.username}</span>
                      <div className="flex items-center space-x-1">
                        {user.country && <Flag code={user.country} className="w-3 h-2 rounded-sm" />}
                        <span className="text-xs text-gray-500">{country?.name}</span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="p-3 border-b">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenuItem onClick={() => setLocation('/profile')} className="p-3">
                    <User className="w-4 h-4 mr-3" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => setLocation('/profile-enhanced')} className="p-3">
                    <Zap className="w-4 h-4 mr-3" />
                    <span>Enhanced Profile</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => setLocation('/wallet')} className="p-3">
                    <Wallet className="w-4 h-4 mr-3" />
                    <span>Wallet & Transactions</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="p-3">
                    <Settings className="w-4 h-4 mr-3" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="p-3">
                    <MessageCircle className="w-4 h-4 mr-3" />
                    <span>Support & Help</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={logout} className="p-3 text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex items-center space-x-2 mb-8">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-red-500">Fire Fight</span>
                </div>
                
                <div className="space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-2 text-gray-700 hover:text-red-500 transition duration-200 ${
                        isActive(item.href) ? "text-red-500 font-semibold" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <Link
                    href="/wallet"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-red-500 transition duration-200"
                  >
                    Wallet (₹{user.walletBalance})
                  </Link>
                  
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-red-500 transition duration-200"
                  >
                    Profile
                  </Link>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-2"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 md:py-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-500 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                  Fire Fight
                </span>
              </div>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                The ultimate gaming tournament platform for competitive players worldwide.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Active Community</span>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="order-2 sm:order-1">
              <h3 className="font-semibold mb-4 text-white flex items-center">
                <div className="w-1 h-4 bg-red-500 rounded-full mr-2"></div>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Home", href: "/" },
                  { name: "Tournaments", href: "/tournaments" },
                  { name: "Teams", href: "/teams" },
                  { name: "Leaderboard", href: "/leaderboard" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center group text-sm md:text-base"
                    >
                      <span className="w-0 h-[1px] bg-red-500 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Support */}
            <div className="order-3 sm:order-2">
              <h3 className="font-semibold mb-4 text-white flex items-center">
                <div className="w-1 h-4 bg-yellow-500 rounded-full mr-2"></div>
                Support
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Help Center", href: "/help" },
                  { name: "Contact Us", href: "#" },
                  { name: "Privacy Policy", href: "#" },
                  { name: "Terms of Service", href: "#" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center group text-sm md:text-base"
                    >
                      <span className="w-0 h-[1px] bg-yellow-500 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Social & Contact */}
            <div className="order-1 sm:order-3 sm:col-span-2 lg:col-span-1">
              <h3 className="font-semibold mb-4 text-white flex items-center">
                <div className="w-1 h-4 bg-blue-500 rounded-full mr-2"></div>
                Connect With Us
              </h3>
              
              {/* Social Media */}
              <div className="flex space-x-3 mb-6">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                  aria-label="Discord"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.445.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-400">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>24/7 Support Available</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Bell className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>Real-time Notifications</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-700/50 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-gray-400">
                <p>&copy; 2024 Fire Fight. All rights reserved.</p>
                <div className="hidden md:block w-px h-4 bg-gray-600"></div>
                <p>Made with ❤️ for gamers worldwide</p>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Server Online
                </span>
                <span>v2.1.0</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
