import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import JoinTournamentModal from "@/components/modals/JoinTournamentModal";
import { Tournament, Game, TournamentParticipant, User, TournamentResult } from "@shared/schema";
import { Trophy, Coins, Clock, Users, Copy, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TournamentDetailsProps {
  id: number;
}

export default function TournamentDetails({ id }: TournamentDetailsProps) {
  const { toast } = useToast();
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const { data: tournament } = useQuery<Tournament>({
    queryKey: ["/api/tournaments", id],
  });

  const { data: game } = useQuery<Game>({
    queryKey: ["/api/games", tournament?.gameId],
    enabled: !!tournament?.gameId,
  });

  const { data: participants } = useQuery<TournamentParticipant[]>({
    queryKey: ["/api/tournaments", id, "participants"],
  });

  const { data: results } = useQuery<TournamentResult[]>({
    queryKey: ["/api/tournaments", id, "results"],
  });

  const copyRoomCode = () => {
    if (tournament?.roomCode) {
      navigator.clipboard.writeText(tournament.roomCode);
      toast({
        title: "Copied!",
        description: "Room code copied to clipboard",
      });
    }
  };

  const formatTimeRemaining = (startTime: Date) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return "Started";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-gray-500 text-lg">Tournament not found</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-green-500";
      case "upcoming": return "bg-orange-500";
      case "ended": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 left-4">
          <Badge className={`${getStatusColor(tournament.status)} text-white`}>
            {tournament.status.toUpperCase()}
          </Badge>
        </div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{tournament.title}</h1>
          <p className="text-white/90">{game?.name} • {tournament.mode}</p>
        </div>
      </div>

      {/* Tournament Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-500">₹{tournament.prizePool}</div>
            <div className="text-sm text-gray-600">Prize Pool</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Coins className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">₹{tournament.entryFee}</div>
            <div className="text-sm text-gray-600">Entry Fee</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{tournament.currentParticipants}/{tournament.maxParticipants}</div>
            <div className="text-sm text-gray-600">Participants</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Tournament Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Game:</span>
                      <span className="font-semibold">{game?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mode:</span>
                      <span className="font-semibold capitalize">{tournament.mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Time:</span>
                      <span className="font-semibold">
                        {tournament.status === "live" ? "Live Now" : 
                         tournament.status === "ended" ? "Completed" :
                         formatTimeRemaining(tournament.startTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Participants:</span>
                      <span className="font-semibold">{tournament.maxParticipants}</span>
                    </div>
                  </div>
                  
                  {tournament.description && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-gray-600">{tournament.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Rules & Regulations</h3>
                  <div className="prose max-w-none">
                    {tournament.rules ? (
                      <p className="text-gray-600">{tournament.rules}</p>
                    ) : (
                      <div className="space-y-3 text-gray-600">
                        <p>• Follow fair play rules at all times</p>
                        <p>• No cheating, hacking, or use of third-party software</p>
                        <p>• Respect other players and maintain good sportsmanship</p>
                        <p>• Join the match room on time</p>
                        <p>• Any disputes will be resolved by tournament officials</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participants" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Participating Players</h3>
                  {participants && participants.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Player</TableHead>
                          <TableHead>Team</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.map((participant) => (
                          <TableRow key={participant.id}>
                            <TableCell>Player #{participant.userId}</TableCell>
                            <TableCell>{participant.teamId ? `Team #${participant.teamId}` : "Solo"}</TableCell>
                            <TableCell>{new Date(participant.joinedAt!).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500">No participants yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Tournament Results</h3>
                  {results && results.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Position</TableHead>
                          <TableHead>Player</TableHead>
                          <TableHead>Kills</TableHead>
                          <TableHead>Points</TableHead>
                          <TableHead>Prize</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((result) => (
                          <TableRow key={result.id}>
                            <TableCell>
                              <Badge variant={result.position <= 3 ? "default" : "outline"}>
                                #{result.position}
                              </Badge>
                            </TableCell>
                            <TableCell>Player #{result.userId}</TableCell>
                            <TableCell>{result.kills}</TableCell>
                            <TableCell>{result.points}</TableCell>
                            <TableCell className="font-semibold text-green-600">
                              ₹{result.prizeWon}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500">
                      {tournament.status === "ended" ? "Results not yet published" : "Tournament not completed"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Join Button */}
          <Card>
            <CardContent className="p-6">
              <Button
                className={`w-full font-semibold text-lg py-6 ${
                  tournament.status === "ended"
                    ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                onClick={() => setJoinModalOpen(true)}
                disabled={tournament.status === "ended"}
              >
                {tournament.status === "ended" ? "Tournament Ended" : "Join Tournament"}
              </Button>
            </CardContent>
          </Card>

          {/* Room Details */}
          {(tournament.status === "live" || tournament.status === "ended") && tournament.roomCode && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Room Details
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Room Code:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-semibold">{tournament.roomCode}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyRoomCode}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {tournament.roomPassword && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Password:</span>
                        <span className="font-mono font-semibold">{tournament.roomPassword}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tournament Schedule */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Schedule
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start:</span>
                  <span className="font-semibold">
                    {new Date(tournament.startTime).toLocaleString()}
                  </span>
                </div>
                {tournament.endTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">End:</span>
                    <span className="font-semibold">
                      {new Date(tournament.endTime).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={getStatusColor(tournament.status)}>
                    {tournament.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <JoinTournamentModal
        open={joinModalOpen}
        onOpenChange={setJoinModalOpen}
        tournament={tournament}
      />
    </div>
  );
}
