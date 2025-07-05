import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Team, Transaction, TournamentParticipant, Tournament } from "@shared/schema";
import { 
  User, Trophy, Star, Target, Clock, Coins, UserPlus, Copy, Share2,
  Edit3, Settings, Shield, Award, Calendar, TrendingUp, TrendingDown,
  MapPin, Phone, Mail, GamepadIcon, ChevronRight, Zap, Crown, Users,
  Plus, Download, Gift
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { countries } from "@/lib/countries";
import { useToast } from "@/hooks/use-toast";
import Flag from "react-world-flags";

export default function ProfileEnhanced() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: userTeams } = useQuery<Team[]>({
    queryKey: ["/api/users", user?.id, "teams"],
    enabled: !!user?.id,
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/users", user?.id, "transactions"],
    enabled: !!user?.id,
  });

  const { data: tournaments } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { data: participations } = useQuery<TournamentParticipant[]>({
    queryKey: ["/api/tournament-participants"],
  });

  const country = countries.find(c => c.code === user?.country);
  const totalWins = userTeams?.reduce((acc, team) => acc + (team.wins || 0), 0) || 0;
  const totalMatches = userTeams?.reduce((acc, team) => acc + (team.matchesPlayed || 0), 0) || 0;
  const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : "0.0";
  
  const userParticipations = participations?.filter(p => p.userId === user?.id) || [];
  const tournamentHistory = userParticipations.map(p => 
    tournaments?.find(t => t.id === p.tournamentId)
  ).filter(Boolean) || [];

  const level = Math.floor(totalMatches / 5) + 1;
  const levelProgress = (totalMatches % 5) * 20;
  const totalEarnings = transactions?.filter(t => 
    t.type === 'tournament_win' || t.type === 'referral_bonus'
  ).reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user?.username}'s Gaming Profile`,
        text: `Check out my Fire Fight gaming profile! Level ${level} with ${totalWins} wins!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Profile link copied to clipboard",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Profile Header */}
        <Card className="overflow-hidden border-0 shadow-2xl">
          <div className="relative h-48 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-8 relative">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8 -mt-20">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-6 border-white shadow-2xl">
                  <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white text-4xl font-bold">
                    {user.username?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 border-4 border-white">
                  <Crown className="w-6 h-6 text-yellow-700" />
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center lg:text-left mt-6">
                <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2">
                  <h1 className="text-4xl font-bold text-gray-900">{user.username}</h1>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Level {level}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                  {user.country && (
                    <>
                      <Flag code={user.country} className="w-6 h-4 rounded-sm" />
                      <span className="text-gray-600 font-medium">{country?.name}</span>
                    </>
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start space-y-2 lg:space-y-0 lg:space-x-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
                
                {/* Level Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Level {level} Progress</span>
                    <span>{totalMatches % 5}/5 matches</span>
                  </div>
                  <Progress value={levelProgress} className="h-3">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" 
                         style={{ width: `${levelProgress}%` }} />
                  </Progress>
                  <p className="text-xs text-gray-500 mt-1">
                    {5 - (totalMatches % 5)} more matches to reach Level {level + 1}
                  </p>
                </div>

                {/* Achievement Badges */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                  <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                    <Trophy className="w-3 h-3 mr-1" />
                    {totalWins} Wins
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                    <Target className="w-3 h-3 mr-1" />
                    {winRate}% Win Rate
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                    <Coins className="w-3 h-3 mr-1" />
                    ₹{totalEarnings.toFixed(0)} Earned
                  </Badge>
                  {userTeams && userTeams.length > 0 && (
                    <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                      <Users className="w-3 h-3 mr-1" />
                      {userTeams.length} Teams
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 lg:w-auto w-full">
                <Button onClick={shareProfile} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
                <Button variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 opacity-10 rounded-bl-full"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Coins className="w-8 h-8 text-green-600" />
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">₹{user.walletBalance}</h3>
              <p className="text-gray-600 text-sm">Wallet Balance</p>
              <div className="mt-2 text-xs text-green-600 font-medium">
                +₹{(parseFloat(user.walletBalance || '0') * 0.1).toFixed(0)} this month
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-10 rounded-bl-full"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{user.bonusCoins}</h3>
              <p className="text-gray-600 text-sm">Bonus Coins</p>
              <div className="mt-2 text-xs text-yellow-600 font-medium">
                Earn more through referrals
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 opacity-10 rounded-bl-full"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-8 h-8 text-blue-600" />
                <Award className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{totalWins}</h3>
              <p className="text-gray-600 text-sm">Total Wins</p>
              <div className="mt-2 text-xs text-blue-600 font-medium">
                {totalMatches} total matches
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 opacity-10 rounded-bl-full"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Zap className="w-8 h-8 text-purple-600" />
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{winRate}%</h3>
              <p className="text-gray-600 text-sm">Win Rate</p>
              <div className="mt-2 text-xs text-purple-600 font-medium">
                Above average performance
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Referral Section */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <UserPlus className="w-6 h-6 mr-3" />
              Referral Program - Earn Bonus Coins!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Invite Friends & Earn Together!</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Share your unique referral code and earn bonus coins when your friends join tournaments. 
                  The more friends you refer, the more you earn!
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm text-gray-500 block">Your Referral Code</span>
                      <div className="text-2xl font-mono font-bold text-indigo-600">{user.referralCode}</div>
                    </div>
                    <Button onClick={copyReferralCode} className="bg-indigo-600 hover:bg-indigo-700">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">50</div>
                      <div className="text-sm text-gray-600">Coins per referral</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {transactions?.filter(t => t.type === 'referral_bonus').length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Friends referred</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">How It Works</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h5 className="font-semibold">Share Your Code</h5>
                      <p className="text-sm text-gray-600">Send your referral code to friends</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h5 className="font-semibold">They Join & Play</h5>
                      <p className="text-sm text-gray-600">Friends sign up and participate in tournaments</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h5 className="font-semibold">Earn Rewards</h5>
                      <p className="text-sm text-gray-600">Get 50 bonus coins for each successful referral</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 p-1 bg-gray-100 rounded-xl h-12">
            <TabsTrigger value="overview" className="rounded-lg font-medium">
              <User className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="teams" className="rounded-lg font-medium">
              <Users className="w-4 h-4 mr-2" />
              Teams ({userTeams?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="rounded-lg font-medium">
              <Trophy className="w-4 h-4 mr-2" />
              Tournaments ({tournamentHistory.length})
            </TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-lg font-medium">
              <Clock className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions?.slice(0, 5).map((transaction, index) => (
                      <div key={transaction.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.type.includes('win') ? 'bg-green-500' :
                          transaction.type.includes('deposit') ? 'bg-blue-500' : 'bg-red-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">{transaction.type.replace('_', ' ')}</p>
                          <p className="text-xs text-gray-500">{transaction.description}</p>
                        </div>
                        <div className="text-sm font-semibold">
                          {transaction.type.includes('deposit') || transaction.type.includes('win') ? '+' : '-'}
                          ₹{transaction.amount}
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Total Earnings</p>
                        <p className="text-2xl font-bold text-green-600">₹{totalEarnings.toFixed(0)}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Match Win Rate</p>
                        <p className="text-2xl font-bold text-blue-600">{winRate}%</p>
                      </div>
                      <Target className="w-8 h-8 text-blue-500" />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Current Level</p>
                        <p className="text-2xl font-bold text-purple-600">Level {level}</p>
                      </div>
                      <Star className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    My Teams
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-red-500 to-orange-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Team
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userTeams && userTeams.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {userTeams.map((team) => (
                      <Card key={team.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{team.name?.charAt(0) || 'T'}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold">{team.name}</h3>
                              <div className="flex items-center space-x-2">
                                {team.country && (
                                  <>
                                    <Flag code={team.country} className="w-4 h-3 rounded-sm" />
                                    <span className="text-sm text-gray-600">
                                      {countries.find(c => c.code === team.country)?.name}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                              Rank #{team.rank}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-xl font-bold text-green-600">{team.wins || 0}</div>
                              <div className="text-xs text-gray-500">Wins</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-blue-600">{team.matchesPlayed || 0}</div>
                              <div className="text-xs text-gray-500">Matches</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-purple-600">
                                {team.matchesPlayed ? ((team.wins || 0) / team.matchesPlayed * 100).toFixed(0) : 0}%
                              </div>
                              <div className="text-xs text-gray-500">Win Rate</div>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="w-full">
                            <ChevronRight className="w-4 h-4 mr-2" />
                            View Team Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Teams Yet</h3>
                    <p className="mb-6">Join or create a team to start competing in tournaments</p>
                    <Button className="bg-gradient-to-r from-red-500 to-orange-500">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Team
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Tournament History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tournamentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {tournamentHistory.map((tournament) => (
                      <div key={tournament?.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <GamepadIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{tournament?.title}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(tournament?.startTime || '').toLocaleDateString()} • 
                              Prize Pool: ₹{tournament?.prizePool}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            className={
                              tournament?.status === 'completed' ? 'bg-gray-500' :
                              tournament?.status === 'live' ? 'bg-red-500' : 'bg-green-500'
                            }
                          >
                            {tournament?.status}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Tournament History</h3>
                    <p className="mb-6">Join your first tournament to start building your gaming legacy</p>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                      <GamepadIcon className="w-4 h-4 mr-2" />
                      Browse Tournaments
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Transaction History
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions && transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type.includes('deposit') ? 'bg-green-100' :
                            transaction.type.includes('win') ? 'bg-yellow-100' :
                            transaction.type.includes('referral') ? 'bg-blue-100' : 'bg-red-100'
                          }`}>
                            {transaction.type.includes('deposit') ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                             transaction.type.includes('win') ? <Trophy className="w-5 h-5 text-yellow-600" /> :
                             transaction.type.includes('referral') ? <UserPlus className="w-5 h-5 text-blue-600" /> :
                             <TrendingDown className="w-5 h-5 text-red-600" />}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{transaction.type.replace('_', ' ')}</p>
                            <p className="text-sm text-gray-600">{transaction.description}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-semibold ${
                            transaction.type.includes('deposit') || transaction.type.includes('win') || transaction.type.includes('referral')
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {transaction.type.includes('deposit') || transaction.type.includes('win') || transaction.type.includes('referral') ? '+' : '-'}
                            ₹{transaction.amount}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Transactions Yet</h3>
                    <p className="mb-6">Your transaction history will appear here</p>
                    <Button className="bg-gradient-to-r from-green-500 to-blue-500">
                      <Coins className="w-4 h-4 mr-2" />
                      Add Money to Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}