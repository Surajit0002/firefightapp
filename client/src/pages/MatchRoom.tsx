import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tournament, TournamentParticipant } from "@shared/schema";
import { Copy, Clock, Users, MapPin, Play, Tv } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatchRoomProps {
  id: number;
}

export default function MatchRoom({ id }: MatchRoomProps) {
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState("");

  const { data: tournament } = useQuery<Tournament>({
    queryKey: ["/api/tournaments", id],
  });

  const { data: participants } = useQuery<TournamentParticipant[]>({
    queryKey: ["/api/tournaments", id, "participants"],
  });

  useEffect(() => {
    if (!tournament) return;

    const updateTimer = () => {
      const now = new Date();
      const start = new Date(tournament.startTime);
      const diff = start.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Match Started");
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [tournament]);

  const copyRoomCode = () => {
    if (tournament?.roomCode) {
      navigator.clipboard.writeText(tournament.roomCode);
      toast({
        title: "Copied!",
        description: "Room code copied to clipboard",
      });
    }
  };

  const copyPassword = () => {
    if (tournament?.roomPassword) {
      navigator.clipboard.writeText(tournament.roomPassword);
      toast({
        title: "Copied!",
        description: "Room password copied to clipboard",
      });
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{tournament.title}</h1>
        <p className="text-gray-600">Match Room</p>
        <Badge 
          className={`mt-2 ${tournament.status === "live" ? "bg-green-500" : "bg-orange-500"}`}
        >
          {tournament.status === "live" ? "LIVE NOW" : "STARTING SOON"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Details */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Room Details
                </h3>
                {tournament.status === "live" && (
                  <Badge className="bg-red-500 animate-pulse">LIVE</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Room ID:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-lg">
                          {tournament.roomCode || "Not Available"}
                        </span>
                        {tournament.roomCode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyRoomCode}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {tournament.roomPassword && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Password:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-lg">
                            {tournament.roomPassword}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyPassword}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mode:</span>
                      <span className="font-semibold capitalize">{tournament.mode}</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Prize Pool:</span>
                      <span className="font-bold text-green-600">₹{tournament.prizePool}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Participants ({participants?.length || 0}/{tournament.maxParticipants})
              </h3>
              
              {participants && participants.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>P{participant.userId}</AvatarFallback>
                            </Avatar>
                            <span>Player #{participant.userId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {participant.teamId ? `Team #${participant.teamId}` : "Solo"}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Ready</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(participant.joinedAt!).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">No participants yet</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Countdown Timer */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 mr-2 text-red-500" />
                <h3 className="text-lg font-semibold">
                  {tournament.status === "live" ? "Match in Progress" : "Starting In"}
                </h3>
              </div>
              
              <div className="text-3xl font-bold text-red-500 mb-4">
                {timeRemaining}
              </div>
              
              {tournament.status === "upcoming" && (
                <p className="text-sm text-gray-600">
                  Be ready to join the game room when the timer reaches zero
                </p>
              )}
            </CardContent>
          </Card>

          {/* Match Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Match Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Time:</span>
                  <span className="font-semibold">
                    {new Date(tournament.startTime).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entry Fee:</span>
                  <span className="font-semibold">₹{tournament.entryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prize Pool:</span>
                  <span className="font-semibold text-green-600">₹{tournament.prizePool}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Players:</span>
                  <span className="font-semibold">{tournament.maxParticipants}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-red-500 hover:bg-red-600" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Join Game
                </Button>
                
                <Button variant="outline" className="w-full" size="lg">
                  <Tv className="w-4 h-4 mr-2" />
                  Watch Stream
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Important Rules</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Join the room 5 minutes before start time</li>
                <li>• Follow fair play guidelines</li>
                <li>• No cheating or third-party tools</li>
                <li>• Screenshots required for disputes</li>
                <li>• Be respectful to other players</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
