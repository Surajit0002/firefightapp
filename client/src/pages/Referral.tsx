import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Gift, 
  Users, 
  Share, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Send,
  TrendingUp,
  Star
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export default function Referral() {
  const { user } = useAuth();

  // Fetch user referrals
  const { data: referrals = [], isLoading: referralsLoading } = useQuery({
    queryKey: ["/api/users", user?.id, "referrals"],
    enabled: !!user?.id,
  });

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const shareOnWhatsApp = () => {
    const message = `Join Fire Fight gaming tournaments using my referral code ${user?.referralCode} and get ₹50 bonus! 🎮🔥`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(`Join Fire Fight gaming tournaments using my referral code ${user?.referralCode}!`)}`;
    window.open(url, '_blank');
  };

  const shareOnTwitter = () => {
    const message = `Join Fire Fight gaming tournaments using my referral code ${user?.referralCode} and get ₹50 bonus! 🎮🔥 #FireFight #Gaming`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Referral Program</h1>
        <p className="text-gray-600">Please login to access the referral program.</p>
      </div>
    );
  }

  const totalEarnings = referrals.reduce((sum: number, ref: any) => sum + (ref.bonusAmount || 0), 0);
  const successfulReferrals = referrals.filter((ref: any) => ref.isRewarded).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Referral & Rewards</h1>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-fire-red to-fire-yellow rounded-3xl p-8 md:p-12 text-white mb-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Invite Friends & Earn ₹50 Each!
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Share your referral code and earn money when your friends join Fire Fight
          </p>
          
          {/* Referral Code Display */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Your Referral Code</h3>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-2xl font-mono font-bold">
                {user.referralCode}
              </div>
              <Button
                onClick={copyReferralCode}
                className="bg-white text-fire-red hover:bg-gray-100"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
          
          {/* Share Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={shareOnWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              onClick={shareOnFacebook}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button
              onClick={shareOnTwitter}
              className="bg-blue-400 hover:bg-blue-500 text-white"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button
              className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              variant="outline"
            >
              <Send className="w-4 h-4 mr-2" />
              More
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Cards */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-fire-red/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-fire-red" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold fire-red">{formatCurrency(totalEarnings)}</h3>
                  <p className="text-gray-600">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-fire-blue/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-fire-blue" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold fire-blue">{successfulReferrals}</h3>
                  <p className="text-gray-600">Successful Referrals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-fire-yellow/10 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-fire-yellow" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold fire-yellow">{referrals.length}</h3>
                  <p className="text-gray-600">Total Invites</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-fire-red rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Share Your Code</h3>
                    <p className="text-gray-600">Share your unique referral code with friends via WhatsApp, social media, or any platform.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-fire-yellow rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Friend Signs Up</h3>
                    <p className="text-gray-600">Your friend registers on Fire Fight using your referral code during signup.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-fire-blue rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">They Play Their First Tournament</h3>
                    <p className="text-gray-600">Once your friend joins and plays their first tournament, the referral is activated.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
                  <div>
                    <h3 className="font-semibold mb-1">You Both Earn ₹50</h3>
                    <p className="text-gray-600">Both you and your friend receive ₹50 bonus in your wallets automatically!</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Referral History */}
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
            </CardHeader>
            <CardContent>
              {referralsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center p-4 animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="w-24 h-3 bg-gray-200 rounded"></div>
                      </div>
                      <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : referrals.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No referrals yet</h3>
                  <p className="text-gray-600 mb-4">Start sharing your referral code to earn rewards!</p>
                  <Button onClick={copyReferralCode} className="bg-fire-red hover:bg-fire-red/90">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Referral Code
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {referrals.map((referral: any) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-fire-red text-white">
                            R{referral.id}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">Referral #{referral.id}</h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(referral.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${referral.isRewarded ? 'text-green-600' : 'text-orange-600'}`}>
                          {referral.isRewarded ? '+' : ''}₹{referral.bonusAmount}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={referral.isRewarded ? 'border-green-600 text-green-600' : 'border-orange-600 text-orange-600'}
                        >
                          {referral.isRewarded ? 'Rewarded' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Terms & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2 text-gray-600">
                <p>• Referral bonus is credited only when the referred user plays their first tournament</p>
                <p>• Both referrer and referee receive ₹50 bonus each</p>
                <p>• Referral rewards are processed within 24 hours of qualification</p>
                <p>• Self-referrals and fake accounts are strictly prohibited</p>
                <p>• Fire Fight reserves the right to modify referral terms at any time</p>
                <p>• Suspicious activities may result in referral bonus forfeiture</p>
                <p>• Only new users are eligible for referral program</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
