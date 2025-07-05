import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import TournamentCard from "@/components/TournamentCard";
import JoinTournamentModal from "@/components/modals/JoinTournamentModal";
import { Tournament, Game } from "@shared/schema";
import { Filter, Search, SlidersHorizontal, Trophy, Clock, Users, Coins } from "lucide-react";

export default function Tournaments() {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    // Search filter
    if (searchQuery) {
      const game = games?.find(g => g.id === tournament.gameId);
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = tournament.title.toLowerCase().includes(searchLower);
      const gameMatch = game?.name.toLowerCase().includes(searchLower);
      const descMatch = tournament.description?.toLowerCase().includes(searchLower);
      if (!titleMatch && !gameMatch && !descMatch) return false;
    }

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

  const getActiveFiltersCount = () => {
    return filters.games.length + filters.entryFees.length + filters.modes.length + filters.statuses.length;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Game Filter */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          Game
        </h4>
        <div className="space-y-3">
          {games?.map(game => (
            <div key={game.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Checkbox
                id={`game-${game.id}`}
                checked={filters.games.includes(game.name)}
                onCheckedChange={(checked) => 
                  handleFilterChange('games', game.name, checked as boolean)
                }
              />
              <Label htmlFor={`game-${game.id}`} className="flex-1 cursor-pointer">{game.name}</Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Entry Fee Filter */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Coins className="w-4 h-4" />
          Entry Fee
        </h4>
        <div className="space-y-3">
          {[
            { id: "free", label: "Free", color: "bg-green-100 text-green-800" },
            { id: "1-100", label: "₹1 - ₹100", color: "bg-blue-100 text-blue-800" },
            { id: "100-500", label: "₹100 - ₹500", color: "bg-yellow-100 text-yellow-800" },
            { id: "500+", label: "₹500+", color: "bg-red-100 text-red-800" },
          ].map(fee => (
            <div key={fee.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Checkbox
                id={`fee-${fee.id}`}
                checked={filters.entryFees.includes(fee.id)}
                onCheckedChange={(checked) => 
                  handleFilterChange('entryFees', fee.id, checked as boolean)
                }
              />
              <Label htmlFor={`fee-${fee.id}`} className="flex-1 cursor-pointer">
                <Badge variant="outline" className={fee.color}>{fee.label}</Badge>
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mode Filter */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Mode
        </h4>
        <div className="space-y-3">
          {[
            { id: "solo", label: "Solo", desc: "Individual play" },
            { id: "duo", label: "Duo", desc: "2 players team" },
            { id: "squad", label: "Squad", desc: "4 players team" }
          ].map(mode => (
            <div key={mode.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Checkbox
                id={`mode-${mode.id}`}
                checked={filters.modes.includes(mode.id)}
                onCheckedChange={(checked) => 
                  handleFilterChange('modes', mode.id, checked as boolean)
                }
              />
              <Label htmlFor={`mode-${mode.id}`} className="flex-1 cursor-pointer">
                <div>
                  <div className="font-medium capitalize">{mode.label}</div>
                  <div className="text-xs text-gray-500">{mode.desc}</div>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Status Filter */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Status
        </h4>
        <div className="space-y-3">
          {[
            { id: "live", label: "Live", color: "bg-red-100 text-red-800", desc: "Currently running" },
            { id: "upcoming", label: "Upcoming", color: "bg-blue-100 text-blue-800", desc: "Starts soon" },
            { id: "ended", label: "Ended", color: "bg-gray-100 text-gray-800", desc: "Already finished" }
          ].map(status => (
            <div key={status.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Checkbox
                id={`status-${status.id}`}
                checked={filters.statuses.includes(status.id)}
                onCheckedChange={(checked) => 
                  handleFilterChange('statuses', status.id, checked as boolean)
                }
              />
              <Label htmlFor={`status-${status.id}`} className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={status.color}>{status.label}</Badge>
                  <span className="text-xs text-gray-500">{status.desc}</span>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Button 
        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
        onClick={() => setFilters({ games: [], entryFees: [], modes: [], statuses: [] })}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
              Tournaments
            </h1>
            <p className="text-gray-600 mt-2">Join competitive gaming tournaments and win amazing prizes!</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tournaments, games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
          
          {/* Desktop Filter Button */}
          <div className="hidden md:block">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative flex items-center gap-2 px-4 py-3 border-2 hover:border-red-300">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                  {getActiveFiltersCount() > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white text-xs px-2 py-1">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-96 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filter Tournaments
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="relative border-2 hover:border-red-300">
                  <Filter className="w-5 h-5" />
                  {getActiveFiltersCount() > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filter Tournaments
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.games.map(game => (
              <Badge key={game} variant="secondary" className="bg-red-100 text-red-800">
                {game}
                <button 
                  onClick={() => handleFilterChange('games', game, false)}
                  className="ml-2 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            ))}
            {filters.entryFees.map(fee => (
              <Badge key={fee} variant="secondary" className="bg-blue-100 text-blue-800">
                {fee === "free" ? "Free" : fee === "1-100" ? "₹1-₹100" : fee === "100-500" ? "₹100-₹500" : "₹500+"}
                <button 
                  onClick={() => handleFilterChange('entryFees', fee, false)}
                  className="ml-2 hover:text-blue-600"
                >
                  ×
                </button>
              </Badge>
            ))}
            {filters.modes.map(mode => (
              <Badge key={mode} variant="secondary" className="bg-green-100 text-green-800 capitalize">
                {mode}
                <button 
                  onClick={() => handleFilterChange('modes', mode, false)}
                  className="ml-2 hover:text-green-600"
                >
                  ×
                </button>
              </Badge>
            ))}
            {filters.statuses.map(status => (
              <Badge key={status} variant="secondary" className="bg-purple-100 text-purple-800 capitalize">
                {status}
                <button 
                  onClick={() => handleFilterChange('statuses', status, false)}
                  className="ml-2 hover:text-purple-600"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {/* Tournament Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{tournaments?.filter(t => t.status === 'live').length || 0}</div>
            <div className="text-sm text-red-700">Live Tournaments</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{tournaments?.filter(t => t.status === 'upcoming').length || 0}</div>
            <div className="text-sm text-blue-700">Upcoming</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{filteredTournaments.length}</div>
            <div className="text-sm text-green-700">Showing</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">₹{tournaments?.reduce((sum, t) => sum + parseFloat(t.prizePool), 0).toLocaleString() || 0}</div>
            <div className="text-sm text-purple-700">Total Prizes</div>
          </CardContent>
        </Card>
      </div>
        
      {/* Tournaments Grid */}
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
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-gray-400" />
          </div>
          <div className="text-gray-500 text-xl mb-4 font-semibold">No tournaments found</div>
          <p className="text-gray-400 mb-6">Try adjusting your filters or search terms, or check back later for new tournaments.</p>
          <Button 
            onClick={() => {
              setFilters({ games: [], entryFees: [], modes: [], statuses: [] });
              setSearchQuery("");
            }}
            className="bg-red-500 hover:bg-red-600"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      <JoinTournamentModal
        open={joinModalOpen}
        onOpenChange={setJoinModalOpen}
        tournament={selectedTournament}
      />
    </div>
  );
}
