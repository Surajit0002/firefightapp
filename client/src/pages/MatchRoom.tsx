import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tournament, Game, TournamentParticipant, User } from "@shared/schema";
import { 
  Trophy, Clock, Users, Zap, Shield, Copy, 
  Radio, Wifi, Volume2, VolumeX, Settings,
  Target, Crosshair, Timer, AlertTriangle,
  Share2, MessageCircle, Crown, Gamepad2
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { countries } from "@/lib/countries";
import { useToast } from "@/hooks/use-toast";
import Flag from "react-world-flags";

interface MatchRoomProps {
  tournamentId?: string;
}

export default function MatchRoom({ tournamentId }: MatchRoomProps) {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const matchId = tournamentId || id;
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [matchPhase, setMatchPhase] = useState<'waiting' | 'starting' | 'active' | 'ended'>('waiting');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');

  const { data: tournament } = useQuery<Tournament>({
    queryKey: ["/api/tournaments", matchId],
    enabled: !!matchId,
  });

  const { data: game } = useQuery<Game>({
    queryKey: ["/api/games", tournament?.gameId],
    enabled: !!tournament?.gameId,
  });

  const { data: participants } = useQuery<TournamentParticipant[]>({
    queryKey: ["/api/tournaments", matchId, "participants"],
    enabled: !!matchId,
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Simulate match timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          setMatchPhase('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate match phases
  useEffect(() => {
    if (timeRemaining <= 0) {
      setMatchPhase('ended');
    } else if (timeRemaining <= 60) {
      setMatchPhase('active');
    } else if (timeRemaining <= 270) {
      setMatchPhase('starting');
    }
  }, [timeRemaining]);

  const participantUsers = participants?.map(p => users?.find(u => u.id === p.userId)).filter(Boolean) || [];
  const isUserParticipant = participants?.some(p => p.userId === user?.id);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyRoomDetails = () => {
    const details = `Room Code: ${tournament?.roomCode}\nPassword: ${tournament?.roomPassword}`;
    navigator.clipboard.writeText(details);
    toast({
      title: "Room Details Copied!",
      description: "Room code and password copied to clipboard",
    });
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'waiting': return 'bg-blue-500';
      case 'starting': return 'bg-yellow-500 animate-pulse';
      case 'active': return 'bg-red-500 animate-pulse';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getConnectionColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (!tournament || !isUserParticipant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You must be a registered participant to access this match room.
            </p>
            <Button 
              onClick={() => setLocation('/tournaments')}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              Back to Tournaments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Tournament Info */}
        <Card className="bg-black/50 border-red-500/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{tournament.title}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className={`${getPhaseColor(matchPhase)} text-white font-semibold px-3 py-1`}>
                      {matchPhase.toUpperCase()}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Wifi className={`w-4 h-4 ${getConnectionColor(connectionStatus)}`} />
                      <span className="text-sm text-gray-300">{connectionStatus}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">{formatTime(timeRemaining)}</div>
                  <div className="text-sm text-gray-400">Time Remaining</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Room Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Details Card */}
            <Card className="bg-black/50 border-red-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Shield className="w-5 h-5 mr-2 text-red-400" />
                  Room Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-900/20 p-6 rounded-xl border border-red-500/20">
                    <h3 className="text-lg font-semibold text-red-400 mb-4">Game Room Access</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-400 text-sm">Room Code</span>
                        <div className="text-2xl font-mono font-bold text-white">{tournament.roomCode}</div>
                      </div>
                      {tournament.roomPassword && (
                        <div>
                          <span className="text-gray-400 text-sm">Password</span>
                          <div className="text-2xl font-mono font-bold text-white">{tournament.roomPassword}</div>
                        </div>
                      )}
                      <Button
                        onClick={copyRoomDetails}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Room Details
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/20">
                    <h3 className="text-lg font-semibold text-blue-400 mb-4">Match Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Game Mode</span>
                        <span className="text-white font-semibold capitalize">{tournament.mode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Prize Pool</span>
                        <span className="text-yellow-400 font-bold">₹{tournament.prizePool}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Players</span>
                        <span className="text-white">{participants?.length}/{tournament.maxParticipants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Game</span>
                        <span className="text-white font-semibold">{game?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Progress */}
            <Card className="bg-black/50 border-red-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Timer className="w-5 h-5 mr-2 text-yellow-400" />
                  Match Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Match Timeline</span>
                    <span>{formatTime(300 - timeRemaining)} elapsed</span>
                  </div>
                  <Progress value={((300 - timeRemaining) / 300) * 100} className="h-4 bg-gray-800">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000"
                      style={{ width: `${((300 - timeRemaining) / 300) * 100}%` }}
                    />
                  </Progress>

                  <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className={`text-center p-3 rounded-lg border ${
                      matchPhase === 'waiting' ? 'bg-blue-900/30 border-blue-500/50' : 'bg-gray-800/50 border-gray-600/50'
                    }`}>
                      <div className="text-xs text-gray-400">Waiting</div>
                      <div className="text-sm font-semibold text-white">0:00-4:30</div>
                    </div>
                    <div className={`text-center p-3 rounded-lg border ${
                      matchPhase === 'starting' ? 'bg-yellow-900/30 border-yellow-500/50' : 'bg-gray-800/50 border-gray-600/50'
                    }`}>
                      <div className="text-xs text-gray-400">Starting</div>
                      <div className="text-sm font-semibold text-white">4:30-1:00</div>
                    </div>
                    <div className={`text-center p-3 rounded-lg border ${
                      matchPhase === 'active' ? 'bg-red-900/30 border-red-500/50' : 'bg-gray-800/50 border-gray-600/50'
                    }`}>
                      <div className="text-xs text-gray-400">Active</div>
                      <div className="text-sm font-semibold text-white">1:00-0:00</div>
                    </div>
                    <div className={`text-center p-3 rounded-lg border ${
                      matchPhase === 'ended' ? 'bg-gray-700/50 border-gray-500/50' : 'bg-gray-800/50 border-gray-600/50'
                    }`}>
                      <div className="text-xs text-gray-400">Ended</div>
                      <div className="text-sm font-semibold text-white">Results</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Updates */}
            <Card className="bg-black/50 border-red-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Radio className="w-5 h-5 mr-2 text-green-400" />
                  Live Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="flex items-start space-x-3 p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                    <div>
                      <p className="text-sm text-white">Match room opened for participants</p>
                      <p className="text-xs text-gray-400">{formatTime(300 - timeRemaining)} ago</p>
                    </div>
                  </div>
                  
                  {matchPhase !== 'waiting' && (
                    <div className="flex items-start space-x-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-white">Match starting phase initiated</p>
                        <p className="text-xs text-gray-400">4 minutes ago</p>
                      </div>
                    </div>
                  )}

                  {matchPhase === 'active' && (
                    <div className="flex items-start space-x-3 p-3 bg-red-900/20 rounded-lg border border-red-500/20">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                      <div>
                        <p className="text-sm text-white">Match is now LIVE! Good luck to all participants!</p>
                        <p className="text-xs text-gray-400">1 minute ago</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3 p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-white">All participants have joined the room</p>
                      <p className="text-xs text-gray-400">5 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participants Panel */}
          <div className="space-y-6">
            <Card className="bg-black/50 border-red-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-400" />
                    Participants ({participantUsers.length})
                  </div>
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    All Joined
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {participantUsers.map((participant, index) => {
                    if (!participant) return null;
                    const country = countries.find(c => c.code === participant.country);
                    const isCurrentUser = participant.id === user?.id;
                    
                    return (
                      <div 
                        key={participant.id} 
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                          isCurrentUser 
                            ? 'bg-blue-900/30 border-blue-500/50' 
                            : 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="text-xs font-bold text-gray-400 w-6">#{index + 1}</div>
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-red-500 text-white text-sm">
                              {participant.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className={`font-semibold truncate ${isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                              {participant.username}
                            </span>
                            {isCurrentUser && <Crown className="w-4 h-4 text-yellow-400" />}
                          </div>
                          <div className="flex items-center space-x-1 text-xs">
                            {participant.country && (
                              <>
                                <Flag code={participant.country} className="w-3 h-2 rounded-sm" />
                                <span className="text-gray-400">{country?.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-gray-400">Online</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-black/50 border-red-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Target className="w-5 h-5 mr-2 text-purple-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={matchPhase !== 'active'}
                >
                  <Crosshair className="w-4 h-4 mr-2" />
                  Join Game Now
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={copyRoomDetails}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Room Details
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Team Chat
                </Button>

                <Separator className="bg-gray-700" />

                <Button 
                  variant="outline" 
                  className="w-full border-red-600 text-red-400 hover:bg-red-900/20"
                  onClick={() => setLocation('/tournaments')}
                >
                  Leave Room
                </Button>
              </CardContent>
            </Card>

            {/* Tournament Rules */}
            <Card className="bg-black/50 border-red-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Shield className="w-5 h-5 mr-2 text-orange-400" />
                  Rules & Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• Fair play is mandatory</p>
                  <p>• No cheating or exploitation</p>
                  <p>• Respect all participants</p>
                  <p>• Follow game room instructions</p>
                  <p>• Report any issues immediately</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Match End Results */}
        {matchPhase === 'ended' && (
          <Card className="bg-black/50 border-yellow-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Match Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white mb-2">Match Completed!</h3>
                <p className="text-gray-400 mb-6">Results are being processed. Check back soon for final standings.</p>
                <Button 
                  onClick={() => setLocation('/tournaments')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  View Tournament Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}