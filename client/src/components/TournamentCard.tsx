import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Coins, Clock, Users } from "lucide-react";
import { Tournament, Game } from "@shared/schema";

interface TournamentCardProps {
  tournament: Tournament;
  game?: Game;
  onJoin?: () => void;
}

export default function TournamentCard({ tournament, game, onJoin }: TournamentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-500";
      case "upcoming":
        return "bg-orange-500";
      case "ended":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "LIVE";
      case "upcoming":
        return "UPCOMING";
      case "ended":
        return "ENDED";
      default:
        return "UNKNOWN";
    }
  };

  const formatTimeRemaining = (startTime: Date) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return "Started";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 left-4">
          <Badge className={`${getStatusColor(tournament.status)} text-white`}>
            {getStatusText(tournament.status)}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 text-gray-900">
            {tournament.currentParticipants}/{tournament.maxParticipants}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{tournament.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{tournament.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-lg font-bold text-red-500">₹{tournament.prizePool}</span>
          </div>
          <div className="flex items-center">
            <Coins className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-sm text-gray-600">₹{tournament.entryFee} Entry</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>
              {tournament.status === "live" ? "Live Now" : 
               tournament.status === "ended" ? "Completed" :
               `Starts in ${formatTimeRemaining(tournament.startTime)}`}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span>{tournament.mode}</span>
          </div>
        </div>
        
        <Button 
          className={`w-full font-semibold transition duration-200 ${
            tournament.status === "ended" 
              ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" 
              : "bg-red-500 hover:bg-red-600"
          }`}
          onClick={onJoin}
          disabled={tournament.status === "ended"}
        >
          {tournament.status === "ended" ? "View Results" : "Join Tournament"}
        </Button>
      </CardContent>
    </Card>
  );
}
