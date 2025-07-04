import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Game } from "@shared/schema";

interface GameCardProps {
  game: Game;
  playerCount?: number;
  onClick?: () => void;
}

export default function GameCard({ game, playerCount = 0, onClick }: GameCardProps) {
  const getGradientColor = (category: string) => {
    switch (category) {
      case "Battle Royale":
        return "from-orange-400 to-red-500";
      case "FPS":
        return "from-blue-400 to-purple-500";
      case "MOBA":
        return "from-green-400 to-teal-500";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
      onClick={onClick}
    >
      <div className={`h-24 bg-gradient-to-br ${getGradientColor(game.category || "")} rounded-t-lg flex items-center justify-center`}>
        <div className="w-16 h-10 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">{game.name.charAt(0)}</span>
        </div>
      </div>
      <CardContent className="p-4 text-center">
        <h3 className="font-semibold text-lg mb-1">{game.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{game.category}</p>
        <div className="flex justify-center items-center">
          <Users className="w-4 h-4 text-red-500 mr-1" />
          <span className="text-sm text-gray-600">{playerCount}k Players</span>
        </div>
      </CardContent>
    </Card>
  );
}
