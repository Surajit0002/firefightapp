import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import JoinTournamentModal from "@/components/modals/JoinTournamentModal";
import { Tournament, Game, TournamentParticipant, User } from "@shared/schema";
import { 
  Trophy, Clock, Users, Coins, MapPin, Calendar, 
  Zap, Target, Award, Star, Share2, Heart,
  Timer, Globe, Shield, GamepadIcon
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { countries } from "@/lib/countries";
import Flag from "react-world-flags";

export default function TournamentDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  const { data: tournament } = useQuery<Tournament>({
    queryKey: ["/api/tournaments", id],
    enabled: !!id,
  });

  const { data: game } = useQuery<Game>({
    queryKey: ["/api/games", tournament?.gameId],
    enabled: !!tournament?.gameId,
  });

  const { data: participants } = useQuery<TournamentParticipant[]>({
    queryKey: ["/api/tournaments", id, "participants"],
    enabled: !!id,
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  if (!tournament) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tournament details...</p>
        </div>
      </div>
    );
  }

  const participantUsers = participants?.map(p => users?.find(u => u.id === p.userId)).filter(Boolean) || [];
  const isUserJoined = participants?.some(p => p.userId === user?.id);
  const spotsRemaining = (tournament.maxParticipants || 0) - (tournament.currentParticipants || 0);
  const progressPercentage = ((tournament.currentParticipants || 0) / (tournament.maxParticipants || 1)) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-red-500 animate-pulse";
      case "upcoming": return "bg-green-500";
      case "completed": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  const handleJoinTournament = () => {
    setSelectedTournament(tournament);
    setJoinModalOpen(true);
  };

  const formatTimeRemaining = (startTime: Date | string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return "Started";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-3xl opacity-10"></div>
          <Card className="relative border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Tournament Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className={`${getStatusColor(tournament.status)} text-white px-3 py-1 text-sm font-semibold`}>
                      {tournament.status.toUpperCase()}
                    </Badge>
                    {tournament.status === "live" && (
                      <div className="flex items-center text-red-500 text-sm font-medium">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                        LIVE NOW
                      </div>
                    )}
                  </div>
                  
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {tournament.title}
                  </h1>
                  
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {tournament.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-xl text-white">
                      <Trophy className="w-6 h-6 mb-2" />
                      <div className="text-sm opacity-90">Prize Pool</div>
                      <div className="text-xl font-bold">₹{tournament.prizePool}</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-400 to-blue-500 p-4 rounded-xl text-white">
                      <Coins className="w-6 h-6 mb-2" />
                      <div className="text-sm opacity-90">Entry Fee</div>
                      <div className="text-xl font-bold">₹{tournament.entryFee}</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-4 rounded-xl text-white">
                      <Users className="w-6 h-6 mb-2" />
                      <div className="text-sm opacity-90">Players</div>
                      <div className="text-xl font-bold">{tournament.currentParticipants}/{tournament.maxParticipants}</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-400 to-pink-500 p-4 rounded-xl text-white">
                      <Clock className="w-6 h-6 mb-2" />
                      <div className="text-sm opacity-90">
                        {tournament.status === "upcoming" ? "Starts In" : "Started"}
                      </div>
                      <div className="text-xl font-bold">
                        {formatTimeRemaining(tournament.startTime)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Tournament Capacity</span>
                      <span>{spotsRemaining} spots remaining</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3 bg-gray-200">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </Progress>
                  </div>
                </div>

                {/* Game Card */}
                {game && (
                  <div className="lg:w-80">
                    <Card className="border-2 border-gray-200 hover:border-red-300 transition-colors">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <GamepadIcon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                        <Badge variant="outline" className="mb-4">{game.category}</Badge>
                        <p className="text-gray-600 text-sm">{game.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                {!isUserJoined && tournament.status === "upcoming" && spotsRemaining > 0 ? (
                  <Button 
                    onClick={handleJoinTournament}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Join Tournament
                  </Button>
                ) : isUserJoined ? (
                  <Button variant="outline" disabled className="px-8 py-3 text-lg">
                    <Shield className="w-5 h-5 mr-2" />
                    Already Joined
                  </Button>
                ) : null}
                
                <Button variant="outline" className="px-6 py-3">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
                
                <Button variant="outline" className="px-6 py-3">
                  <Heart className="w-5 h-5 mr-2" />
                  Favorite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="participants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 p-1 bg-gray-100 rounded-xl">
            <TabsTrigger value="participants" className="rounded-lg font-medium">
              <Users className="w-4 h-4 mr-2" />
              Participants ({participants?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="rules" className="rounded-lg font-medium">
              <Shield className="w-4 h-4 mr-2" />
              Rules & Format
            </TabsTrigger>
            <TabsTrigger value="prizes" className="rounded-lg font-medium">
              <Trophy className="w-4 h-4 mr-2" />
              Prize Distribution
            </TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-lg font-medium">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Registered Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {participantUsers.map((participant, index) => {
                    if (!participant) return null;
                    const country = countries.find(c => c.code === participant.country);
                    return (
                      <div key={participant.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-bold text-gray-500 w-6">#{index + 1}</div>
                          <Avatar>
                            <AvatarFallback className="bg-red-500 text-white">
                              {participant.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {participant.username}
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            {participant.country && (
                              <>
                                <Flag code={participant.country} className="w-4 h-3 rounded-sm" />
                                <span>{country?.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {participantUsers.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No participants yet. Be the first to join!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Tournament Rules & Format
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-xl">
                    <Target className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                    <h3 className="font-semibold mb-2">Game Mode</h3>
                    <p className="text-sm text-gray-600 capitalize">{tournament.mode}</p>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <Timer className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <h3 className="font-semibold mb-2">Duration</h3>
                    <p className="text-sm text-gray-600">2-3 Hours</p>
                  </div>
                  
                  <div className="text-center p-6 bg-purple-50 rounded-xl">
                    <Globe className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                    <h3 className="font-semibold mb-2">Region</h3>
                    <p className="text-sm text-gray-600">Global</p>
                  </div>
                </div>

                <Separator />

                <div className="prose max-w-none">
                  <h4 className="text-lg font-semibold mb-3">Tournament Rules</h4>
                  <div className="bg-gray-50 p-6 rounded-xl text-sm leading-relaxed">
                    {tournament.rules || "Standard tournament rules apply. Fair play is mandatory. No cheating or exploitation allowed."}
                  </div>
                </div>

                {tournament.roomCode && (
                  <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                    <h4 className="font-semibold text-red-800 mb-2">Room Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Room Code:</span>
                        <span className="ml-2 font-mono font-bold text-red-600">{tournament.roomCode}</span>
                      </div>
                      {tournament.roomPassword && (
                        <div>
                          <span className="text-gray-600">Password:</span>
                          <span className="ml-2 font-mono font-bold text-red-600">{tournament.roomPassword}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prizes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Prize Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl">
                    <Trophy className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold">1st Place</h3>
                    <p className="text-3xl font-bold mt-2">₹{(parseFloat(tournament.prizePool) * 0.5).toFixed(0)}</p>
                    <p className="text-sm opacity-90 mt-1">50% of prize pool</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-gray-400 to-gray-600 text-white rounded-xl">
                    <Award className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold">2nd Place</h3>
                    <p className="text-3xl font-bold mt-2">₹{(parseFloat(tournament.prizePool) * 0.3).toFixed(0)}</p>
                    <p className="text-sm opacity-90 mt-1">30% of prize pool</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-xl">
                    <Star className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold">3rd Place</h3>
                    <p className="text-3xl font-bold mt-2">₹{(parseFloat(tournament.prizePool) * 0.2).toFixed(0)}</p>
                    <p className="text-sm opacity-90 mt-1">20% of prize pool</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Tournament Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                    <Clock className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">Registration Deadline</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(new Date(tournament.startTime).getTime() - 30 * 60000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-green-50 rounded-xl">
                    <Zap className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">Tournament Start</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(tournament.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">Check-in</h4>
                      <p className="text-sm text-gray-600">15 minutes before start time</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Join Tournament Modal */}
      {selectedTournament && (
        <JoinTournamentModal
          isOpen={joinModalOpen}
          onClose={() => setJoinModalOpen(false)}
          tournament={selectedTournament}
          game={game}
        />
      )}
    </div>
  );
}