import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Share2, Gift, Users, TrendingUp, Facebook, MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function Referral() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shareMethod, setShareMethod] = useState("");

  const referralLink = `https://firefight.gg/register?ref=${user?.referralCode}`;

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareViaWhatsApp = () => {
    const message = `Join Fire Fight gaming tournament platform and earn real money! Use my referral code: ${user?.referralCode}. Sign up here: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareMethods = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500",
      action: shareViaWhatsApp,
    },
    {
      id: "facebook", 
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-500",
      action: shareViaFacebook,
    },
    {
      id: "copy",
      name: "Copy Link",
      icon: Copy,
      color: "bg-gray-500",
      action: copyReferralLink,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Referral & Rewards</h1>
        <p className="text-gray-600">Invite friends and earn money together!</p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-yellow-500 rounded-3xl p-8 md:p-12 text-center text-white mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Earn ₹50 for Every Friend!
        </h2>
        <p className="text-xl mb-8 text-white/90">
          Your friends get ₹25 bonus when they sign up with your code
        </p>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Your Referral Code</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white/30 backdrop-blur-sm rounded-lg px-6 py-3 text-2xl font-mono font-bold">
              {user?.referralCode || "LOADING..."}
            </div>
            <Button
              className="bg-white text-red-500 hover:bg-gray-100"
              onClick={copyReferralCode}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Overview */}
        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Friends Referred</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600">₹0</div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-yellow-600">₹50</div>
                <div className="text-sm text-gray-600">Per Referral</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Share Methods */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">Share with Friends</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {shareMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <Button
                      key={method.id}
                      variant="outline"
                      className="h-auto p-4 flex-col space-y-2 hover:scale-105 transition-transform"
                      onClick={method.action}
                    >
                      <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold">{method.name}</span>
                    </Button>
                  );
                })}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium mb-2">Referral Link</label>
                <div className="flex space-x-2">
                  <Input
                    value={referralLink}
                    readOnly
                    className="bg-white"
                  />
                  <Button onClick={copyReferralLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">How It Works</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Share your code</h4>
                    <p className="text-gray-600">Send your referral code or link to friends</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Friend signs up</h4>
                    <p className="text-gray-600">They create an account using your referral code</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Friend plays first tournament</h4>
                    <p className="text-gray-600">They join and play their first tournament</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">You both earn!</h4>
                    <p className="text-gray-600">You get ₹50, your friend gets ₹25 bonus</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral History */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">Referral History</h3>
              
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Referrals Yet</h4>
                <p className="text-gray-500 mb-6">Start inviting friends to see your referral history here.</p>
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  onClick={shareViaWhatsApp}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Terms & Conditions</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Referral bonus is credited only when referred friend completes their first tournament</p>
                <p>• Maximum 50 referrals per user per month</p>
                <p>• Self-referrals or fake accounts will result in account suspension</p>
                <p>• Referral earnings can be withdrawn to bank account</p>
                <p>• Fire Fight reserves the right to modify referral program terms</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
