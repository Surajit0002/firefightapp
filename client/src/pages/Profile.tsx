import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Team, Transaction } from "@shared/schema";
import { User, Trophy, Copy, Edit, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { countries } from "@/lib/countries";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: userTeams } = useQuery<Team[]>({
    queryKey: ["/api/users", user?.id, "teams"],
    enabled: !!user?.id,
  });

  const { data: recentTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/users", user?.id, "transactions"],
    enabled: !!user?.id,
  });

  const country = countries.find(c => c.code === user?.country);
  const totalWins = userTeams?.reduce((acc, team) => acc + team.wins, 0) || 0;
  const totalMatches = userTeams?.reduce((acc, team) => acc + team.matchesPlayed, 0) || 0;
  const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : "0.0";

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const gamePreferences = ["Free Fire", "PUBG", "Call of Duty", "Apex Legends"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarFallback className="bg-red-500 text-white text-2xl">
                  {user?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-2xl font-bold mb-2">{user?.username}</h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                {country && (
                  <>
                    <span className="text-2xl">{country.flag}</span>
                    <span className="text-sm text-gray-600">{country.name}</span>
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{totalWins}</div>
                  <div className="text-sm text-gray-600">Total Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{winRate}%</div>
                  <div className="text-sm text-gray-600">Win Rate</div>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </Button>
            </CardContent>
          </Card>

          {/* Game Stats */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Game Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Games Played</span>
                  <span className="font-semibold">{totalMatches}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tournaments Won</span>
                  <span className="font-semibold">{totalWins}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Teams</span>
                  <span className="font-semibold">{userTeams?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Earnings</span>
                  <span className="font-semibold text-green-600">₹{user?.walletBalance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="referral">Referral</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={user?.username || ""}
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-gray-50"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-gray-50"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={user?.phone || ""}
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-gray-50"}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select disabled={!isEditing} value={user?.country || ""}>
                        <SelectTrigger className={isEditing ? "" : "bg-gray-50"}>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              <div className="flex items-center space-x-2">
                                <span>{country.flag}</span>
                                <span>{country.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end space-x-4 mt-6">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-red-500 hover:bg-red-600">
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Game Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {gamePreferences.map((game) => (
                      <Badge key={game} variant="outline" className="text-sm">
                        {game}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">My Teams</h3>
                  {userTeams && userTeams.length > 0 ? (
                    <div className="space-y-4">
                      {userTeams.map((team) => {
                        const teamCountry = countries.find(c => c.code === team.country);
                        return (
                          <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {team.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold">{team.name}</h4>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  {teamCountry && (
                                    <>
                                      <span>{teamCountry.flag}</span>
                                      <span>{teamCountry.name}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">{team.wins} Wins</div>
                              <div className="text-sm text-gray-600">{team.matchesPlayed} Matches</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-500">No teams found</div>
                      <p className="text-gray-400">Join or create a team to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Security Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                    
                    <Button className="bg-red-500 hover:bg-red-600">
                      <Shield className="w-4 h-4 mr-2" />
                      Update Security Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="referral" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Referral Program</h3>
                  
                  <div className="bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg p-6 text-white mb-6">
                    <h4 className="text-lg font-semibold mb-2">Your Referral Code</h4>
                    <div className="flex items-center justify-between">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 font-mono text-lg">
                        {user?.referralCode}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-none"
                        onClick={copyReferralCode}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-gray-600">Friends Referred</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">₹0</div>
                      <div className="text-sm text-gray-600">Earnings</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">₹50</div>
                      <div className="text-sm text-gray-600">Per Referral</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">How it works:</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Share your referral code with friends</li>
                      <li>• They sign up and play their first tournament</li>
                      <li>• You earn ₹50 for each successful referral</li>
                      <li>• Your friend gets ₹25 bonus on signup</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
