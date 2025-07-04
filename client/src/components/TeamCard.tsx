import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Copy, Edit, MoreVertical, Plus, Users } from "lucide-react";
import { Team } from "@shared/schema";
import { countries } from "@/lib/countries";

interface TeamCardProps {
  team: Team;
  onEdit?: () => void;
  onView?: () => void;
  onAddMember?: () => void;
}

export default function TeamCard({ team, onEdit, onView, onAddMember }: TeamCardProps) {
  const country = countries.find(c => c.code === team.country);
  
  const copyJoinCode = () => {
    if (team.joinCode) {
      navigator.clipboard.writeText(team.joinCode);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {team.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{team.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{country?.flag}</span>
                <span className="text-sm text-gray-600">{country?.name}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Team Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{team.wins}</div>
            <div className="text-sm text-gray-600">Wins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{team.matchesPlayed}</div>
            <div className="text-sm text-gray-600">Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{team.rank || "Unranked"}</div>
            <div className="text-sm text-gray-600">Rank</div>
          </div>
        </div>
        
        {/* Team Members */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold">Members ({team.currentMembers}/{team.maxMembers})</h4>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600"
            onClick={onAddMember}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="flex -space-x-2 mb-4">
          {Array.from({ length: Math.min(team.currentMembers, 6) }).map((_, i) => (
            <Avatar key={i} className="w-8 h-8 border-2 border-white">
              <AvatarFallback className="bg-red-500 text-white text-sm">
                {String.fromCharCode(65 + i)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        
        {/* Join Code */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Join Code:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-semibold">{team.joinCode}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyJoinCode}
                className="text-red-500 hover:text-red-600"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-red-500 hover:bg-red-600"
            onClick={onView}
          >
            View Details
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
