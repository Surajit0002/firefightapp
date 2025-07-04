import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Play, 
  Pause, 
  Trophy,
  Users,
  Clock,
  Coins,
  Search,
  Filter
} from "lucide-react";
import { formatCurrency, formatDate, getTournamentStatusColor, getTournamentStatusText } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminTournaments() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [tournamentForm, setTournamentForm] = useState({
    title: "",
    description: "",
    gameId: "",
    entryFee: "",
    prizePool: "",
    maxParticipants: "",
    mode: "solo",
    startTime: "",
    rules: "",
    organizerId: 1, // Admin ID
  });

  // Fetch tournaments
  const { data: tournaments = [], isLoading: tournamentsLoading } = useQuery({
    queryKey: ["/api/tournaments"],
  });

  // Fetch games for dropdown
  const { data: games = [] } = useQuery({
    queryKey: ["/api/games"],
  });

  // Create tournament mutation
  const createTournamentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/tournaments', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success!",
        description: "Tournament created successfully",
      });
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create tournament",
        variant: "destructive",
      });
    },
  });

  // Update tournament mutation
  const updateTournamentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest('PUT', `/api/tournaments/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success!",
        description: "Tournament updated successfully",
      });
      setSelectedTournament(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update tournament",
        variant: "destructive",
      });
    },
  });

  const handleCreateTournament = () => {
    if (!tournamentForm.title || !tournamentForm.gameId || !tournamentForm.prizePool || !tournamentForm.maxParticipants || !tournamentForm.startTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      ...tournamentForm,
      gameId: parseInt(tournamentForm.gameId),
      entryFee: parseInt(tournamentForm.entryFee) || 0,
      prizePool: parseInt(tournamentForm.prizePool),
      maxParticipants: parseInt(tournamentForm.maxParticipants),
      startTime: new Date(tournamentForm.startTime).toISOString(),
      status: "upcoming",
      isActive: true,
    };

    createTournamentMutation.mutate(formData);
  };

  const handleUpdateTournamentStatus = (tournament: any, newStatus: string) => {
    updateTournamentMutation.mutate({
      id: tournament.id,
      data: { status: newStatus }
    });
  };

  const resetForm = () => {
    setTournamentForm({
      title: "",
      description: "",
      gameId: "",
      entryFee: "",
      prizePool: "",
      maxParticipants: "",
      mode: "solo",
      startTime: "",
      rules: "",
      organizerId: 1,
    });
  };

  const filteredTournaments = tournaments.filter((tournament: any) => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tournament.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getActionButton = (tournament: any) => {
    switch (tournament.status) {
      case 'upcoming':
        return (
          <Button
            size="sm"
            onClick={() => handleUpdateTournamentStatus(tournament, 'live')}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4 mr-1" />
            Start
          </Button>
        );
      case 'live':
        return (
          <Button
            size="sm"
            onClick={() => handleUpdateTournamentStatus(tournament, 'ended')}
            className="bg-red-600 hover:bg-red-700"
          >
            <Pause className="w-4 h-4 mr-1" />
            End
          </Button>
        );
      default:
        return (
          <Button size="sm" variant="outline" disabled>
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tournament Management</h1>
          <p className="text-gray-600">Create and manage gaming tournaments</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-fire-red hover:bg-fire-red/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Tournament
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Tournament</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={tournamentForm.title}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Tournament title"
                  />
                </div>
                <div>
                  <Label>Game *</Label>
                  <Select value={tournamentForm.gameId} onValueChange={(value) => setTournamentForm(prev => ({ ...prev, gameId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select game" />
                    </SelectTrigger>
                    <SelectContent>
                      {games.map((game: any) => (
                        <SelectItem key={game.id} value={game.id.toString()}>
                          {game.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={tournamentForm.description}
                  onChange={(e) => setTournamentForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tournament description"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Entry Fee</Label>
                  <Input
                    type="number"
                    value={tournamentForm.entryFee}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, entryFee: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Prize Pool *</Label>
                  <Input
                    type="number"
                    value={tournamentForm.prizePool}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, prizePool: e.target.value }))}
                    placeholder="10000"
                  />
                </div>
                <div>
                  <Label>Max Participants *</Label>
                  <Input
                    type="number"
                    value={tournamentForm.maxParticipants}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, maxParticipants: e.target.value }))}
                    placeholder="50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Mode</Label>
                  <Select value={tournamentForm.mode} onValueChange={(value) => setTournamentForm(prev => ({ ...prev, mode: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo</SelectItem>
                      <SelectItem value="duo">Duo</SelectItem>
                      <SelectItem value="squad">Squad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Start Time *</Label>
                  <Input
                    type="datetime-local"
                    value={tournamentForm.startTime}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label>Rules</Label>
                <Textarea
                  value={tournamentForm.rules}
                  onChange={(e) => setTournamentForm(prev => ({ ...prev, rules: e.target.value }))}
                  placeholder="Tournament rules and regulations"
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTournament}
                  disabled={createTournamentMutation.isPending}
                  className="flex-1 bg-fire-red hover:bg-fire-red/90"
                >
                  {createTournamentMutation.isPending ? "Creating..." : "Create Tournament"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tournaments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tournaments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tournaments ({filteredTournaments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tournamentsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg animate-pulse">
                  <div className="w-full h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredTournaments.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tournaments found</h3>
              <p className="text-gray-600">Create your first tournament to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Prize Pool</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTournaments.map((tournament: any) => {
                  const game = games.find((g: any) => g.id === tournament.gameId);
                  return (
                    <TableRow key={tournament.id}>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{tournament.title}</div>
                          <div className="text-sm text-gray-600">{tournament.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{game?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge className={`${getTournamentStatusColor(tournament.status)} text-white`}>
                          {getTournamentStatusText(tournament.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Coins className="w-4 h-4 text-fire-yellow" />
                          <span className="font-semibold">{formatCurrency(tournament.prizePool)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{formatDate(tournament.startTime)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {getActionButton(tournament)}
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
