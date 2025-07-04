import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import { User } from "@shared/schema";
import { countries } from "@/lib/countries";

interface PlayerCardProps {
  user: User;
  rank?: number;
  points?: number;
  game?: string;
  onClick?: () => void;
}

export default function PlayerCard({ user, rank, points, game, onClick }: PlayerCardProps) {
  const country = countries.find(c => c.code === user.country);
  
  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-gray-400 to-gray-600";
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500";
    if (rank === 2) return "bg-gray-400";
    if (rank === 3) return "bg-orange-500";
    return "bg-gray-600";
  };

  return (
    <div 
      className="text-center group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative mb-4">
        <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${rank ? getRankColor(rank) : "from-red-500 to-yellow-500"} p-1`}>
          <Avatar className="w-full h-full">
            <AvatarFallback className="bg-white text-gray-900 text-lg font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        {rank && (
          <div className={`absolute -top-2 -right-2 w-8 h-8 ${getRankBadgeColor(rank)} rounded-full flex items-center justify-center`}>
            <span className="text-white text-xs font-bold">{rank}</span>
          </div>
        )}
      </div>
      
      <h3 className="font-semibold text-lg group-hover:text-red-500 transition duration-200">
        {user.username}
      </h3>
      
      {points && (
        <p className="text-sm text-gray-600">{points} Points</p>
      )}
      
      <div className="flex justify-center items-center mt-2 space-x-2">
        {country && (
          <>
            <span className="text-lg">{country.flag}</span>
            <span className="text-xs text-gray-500">{country.name}</span>
          </>
        )}
      </div>
      
      {game && (
        <div className="flex justify-center mt-2">
          <Badge className="bg-red-500 text-white text-xs">
            {game}
          </Badge>
        </div>
      )}
      
      {rank && rank <= 3 && (
        <div className="flex justify-center mt-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
        </div>
      )}
    </div>
  );
}
