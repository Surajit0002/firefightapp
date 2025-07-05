
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Copy, Edit, MoreVertical, Plus, Users, Trophy, Target } from "lucide-react";
import { Team } from "@shared/schema";
import { countries } from "@/lib/countries";
import Flag from "react-world-flags";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamCardProps {
  team: Team;
  onEdit?: () => void;
  onView?: () => void;
  onAddMember?: () => void;
}

// Colorful gradient backgrounds
const cardBackgrounds = [
  "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500",
  "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500",
  "bg-gradient-to-br from-green-500 via-emerald-500 to-lime-500",
  "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500",
  "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
  "bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500",
  "bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500",
  "bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500",
];

export default function TeamCard({ team, onEdit, onView, onAddMember }: TeamCardProps) {
  const country = countries.find(c => c.code === team.country);
  const cardBg = cardBackgrounds[team.id % cardBackgrounds.length];
  
  const copyJoinCode = () => {
    if (team.joinCode) {
      navigator.clipboard.writeText(team.joinCode);
    }
  };

  return (
    <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      {/* Colorful Header */}
      <div className={`${cardBg} p-4 text-white relative`}>
        <div className="flex items-center justify-between">
          {/* Left: Team Logo, Name, Country */}
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <span className="text-white font-bold text-xl">
                {team.name?.charAt(0) || 'T'}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white drop-shadow-sm">{team.name}</h3>
              <div className="flex items-center space-x-2">
                {team.country && (
                  <>
                    <Flag code={team.country} className="w-5 h-4 rounded-sm shadow-sm" />
                    <span className="text-white/90 text-sm font-medium">{country?.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Center: Join Code */}
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
            <span className="text-white/90 text-xs font-medium">Join Code:</span>
            <span className="font-mono font-bold text-white text-sm">{team.joinCode}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyJoinCode}
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>

          {/* Right: 3-dot Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8 w-8 p-0">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onView}>
                <Users className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Team
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddMember}>
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CardContent className="p-6 bg-white">
        {/* Team Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4 text-green-600 mr-1" />
              <div className="text-2xl font-bold text-green-600">{team.wins}</div>
            </div>
            <div className="text-sm text-green-700 font-medium">Wins</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-blue-600 mr-1" />
              <div className="text-2xl font-bold text-blue-600">{team.matchesPlayed}</div>
            </div>
            <div className="text-sm text-blue-700 font-medium">Matches</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
            <div className="flex items-center justify-center mb-1">
              <div className="text-2xl font-bold text-orange-600">{team.rank || "NR"}</div>
            </div>
            <div className="text-sm text-orange-700 font-medium">Rank</div>
          </div>
        </div>
        
        {/* Team Members Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Users className="w-4 h-4 mr-2 text-gray-600" />
              Members ({team.currentMembers}/{team.maxMembers})
            </h4>
            <Badge 
              variant={team.currentMembers === team.maxMembers ? "destructive" : "secondary"}
              className="text-xs"
            >
              {team.currentMembers === team.maxMembers ? "Full" : `${team.maxMembers - team.currentMembers} slots left`}
            </Badge>
          </div>
          
          <div className="flex -space-x-2">
            {Array.from({ length: Math.min(team.currentMembers, 8) }).map((_, i) => (
              <Avatar key={i} className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarFallback className={`${cardBg} text-white text-sm font-semibold`}>
                  {String.fromCharCode(65 + i)}
                </AvatarFallback>
              </Avatar>
            ))}
            {team.currentMembers > 8 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center shadow-sm">
                <span className="text-xs font-medium text-gray-600">+{team.currentMembers - 8}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Win Rate Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Win Rate</span>
            <span className="text-sm font-bold text-gray-900">
              {team.matchesPlayed > 0 ? ((team.wins / team.matchesPlayed) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${team.matchesPlayed > 0 ? (team.wins / team.matchesPlayed) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </div>
        
        {/* Action Button */}
        <Button 
          className={`w-full ${cardBg} hover:opacity-90 text-white font-semibold py-2 transition-all duration-200`}
          onClick={onView}
        >
          View Team Details
        </Button>
      </CardContent>
    </Card>
  );
}
