import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import TournamentCard from "@/components/TournamentCard";
import JoinTournamentModal from "@/components/modals/JoinTournamentModal";
import { Tournament, Game } from "@shared/schema";
import { Filter } from "lucide-react";

export default function Tournaments() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    games: [] as string[],
    entryFees: [] as string[],
    modes: [] as string[],
    statuses: [] as string[],
  });

  const { data: tournaments } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const handleJoinTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setJoinModalOpen(true);
  };

  const handleFilterChange = (category: keyof typeof filters, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const filteredTournaments = tournaments?.filter(tournament => {
    if (filters.games.length > 0) {
      const game = games?.find(g => g.id === tournament.gameId);
      if (!game || !filters.games.includes(game.name)) return false;
    }
    
    if (filters.entryFees.length > 0) {
      const fee = parseFloat(tournament.entryFee);
      const feeRange = filters.entryFees.some(range => {
        switch (range) {
          case "free": return fee === 0;
          case "1-100": return fee >= 1 && fee <= 100;
          case "100-500": return fee > 100 && fee <= 500;
          case "500+": return fee > 500;
          default: return false;
        }
      });
      if (!feeRange) return false;
    }
    
    if (filters.modes.length > 0 && !filters.modes.includes(tournament.mode)) {
      return false;
    }
    
    if (filters.statuses.length > 0 && !filters.statuses.includes(tournament.status)) {
      return false;
    }
    
    return true;
  }) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tournaments</h1>
        <Button
          variant="outline"
          className="md:hidden"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </Button>
      </div>
      
      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <div className={`w-80 bg-white rounded-lg shadow-lg p-6 ${filterOpen ? 'block' : 'hidden'} md:block`}>
          <h3 className="text-xl font-semibold mb-6">Filters</h3>
          
          {/* Game Filter */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Game</h4>
            <div className="space-y-2">
              {games?.map(game => (
                <div key={game.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`game-${game.id}`}
                    checked={filters.games.includes(game.name)}
                    onCheckedChange={(checked) => 
                      handleFilterChange('games', game.name, checked as boolean)
                    }
                  />
                  <Label htmlFor={`game-${game.id}`}>{game.name}</Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Entry Fee Filter */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Entry Fee</h4>
            <div className="space-y-2">
              {[
                { id: "free", label: "Free" },
                { id: "1-100", label: "₹1 - ₹100" },
                { id: "100-500", label: "₹100 - ₹500" },
                { id: "500+", label: "₹500+" },
              ].map(fee => (
                <div key={fee.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fee-${fee.id}`}
                    checked={filters.entryFees.includes(fee.id)}
                    onCheckedChange={(checked) => 
                      handleFilterChange('entryFees', fee.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`fee-${fee.id}`}>{fee.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mode Filter */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Mode</h4>
            <div className="space-y-2">
              {["solo", "duo", "squad"].map(mode => (
                <div key={mode} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mode-${mode}`}
                    checked={filters.modes.includes(mode)}
                    onCheckedChange={(checked) => 
                      handleFilterChange('modes', mode, checked as boolean)
                    }
                  />
                  <Label htmlFor={`mode-${mode}`} className="capitalize">{mode}</Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Status</h4>
            <div className="space-y-2">
              {["live", "upcoming", "ended"].map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.statuses.includes(status)}
                    onCheckedChange={(checked) => 
                      handleFilterChange('statuses', status, checked as boolean)
                    }
                  />
                  <Label htmlFor={`status-${status}`} className="capitalize">{status}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full bg-red-500 hover:bg-red-600"
            onClick={() => setFilters({ games: [], entryFees: [], modes: [], statuses: [] })}
          >
            Clear Filters
          </Button>
        </div>
        
        {/* Tournaments Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map(tournament => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                game={games?.find(g => g.id === tournament.gameId)}
                onJoin={() => handleJoinTournament(tournament)}
              />
            ))}
          </div>
          
          {filteredTournaments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No tournaments found</div>
              <p className="text-gray-400">Try adjusting your filters or check back later for new tournaments.</p>
            </div>
          )}
        </div>
      </div>

      <JoinTournamentModal
        open={joinModalOpen}
        onOpenChange={setJoinModalOpen}
        tournament={selectedTournament}
      />
    </div>
  );
}
