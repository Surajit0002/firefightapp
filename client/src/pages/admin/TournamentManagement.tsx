import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/App";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, Users, Trophy, Calendar, DollarSign, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Tournament } from "@shared/schema";
import { GAMES, TOURNAMENT_MODES } from "@/lib/constants";

export default function TournamentManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  const { data: tournaments = [], isLoading } = useQuery({
    queryKey: ["/api/tournaments"],
  });

  const createTournamentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/tournaments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      setCreateModalOpen(false);
      reset();
      toast({
        title: "Success",
        description: "Tournament created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTournamentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PUT", `/api/tournaments/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      setEditModalOpen(false);
      setSelectedTournament(null);
      reset();
      toast({
        title: "Success",
        description: "Tournament updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTournamentMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/tournaments/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success",
        description: "Tournament deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onCreateSubmit = (data: any) => {
    createTournamentMutation.mutate({
      ...data,
      startTime: new Date(data.startTime).toISOString(),
    });
  };

  const onEditSubmit = (data: any) => {
    if (selectedTournament) {
      updateTournamentMutation.mutate({
        id: selectedTournament.id,
        data: {
          ...data,
          startTime: new Date(data.startTime).toISOString(),
        },
      });
    }
  };

  const handleEdit = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setValue("title", tournament.title);
    setValue("game", tournament.game);
    setValue("description", tournament.description);
    setValue("prizePool", tournament.prizePool);
    setValue("entryFee", tournament.entryFee);
    setValue("maxParticipants", tournament.maxParticipants);
    setValue("mode", tournament.mode);
    setValue("roomCode", tournament.roomCode || "");
    setValue("roomPassword", tournament.roomPassword || "");
    setValue("startTime", new Date(tournament.startTime).toISOString().slice(0, 16));
    setEditModalOpen(true);
  };

  const handleDelete = (tournament: Tournament) => {
    if (confirm(`Are you sure you want to delete "${tournament.title}"?`)) {
      deleteTournamentMutation.mutate(tournament.id);
    }
  };

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

  const filteredTournaments = tournaments.filter((tournament: Tournament) =>
    tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournament.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TournamentForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={handleSubmit(isEdit ? onEditSubmit : onCreateSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Tournament Title</Label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>
          )}
        </div>
        <div>
          <Label htmlFor="game">Game</Label>
          <Select value={watch("game")} onValueChange={(value) => setValue("game", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select game" />
            </SelectTrigger>
            <SelectContent>
              {GAMES.map((game) => (
                <SelectItem key={game.id} value={game.name}>
                  {game.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="mode">Mode</Label>
          <Select value={watch("mode")} onValueChange={(value) => setValue("mode", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              {TOURNAMENT_MODES.map((mode) => (
                <SelectItem key={mode.id} value={mode.id}>
                  {mode.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="maxParticipants">Max Participants</Label>
          <Input
            id="maxParticipants"
            type="number"
            {...register("maxParticipants", { required: "Max participants is required" })}
          />
        </div>
        <div>
          <Label htmlFor="prizePool">Prize Pool (₹)</Label>
          <Input
            id="prizePool"
            type="number"
            step="0.01"
            {...register("prizePool", { required: "Prize pool is required" })}
          />
        </div>
        <div>
          <Label htmlFor="entryFee">Entry Fee (₹)</Label>
          <Input
            id="entryFee"
            type="number"
            step="0.01"
            {...register("entryFee", { required: "Entry fee is required" })}
          />
        </div>
        <div>
          <Label htmlFor="roomCode">Room Code</Label>
          <Input
            id="roomCode"
            {...register("roomCode")}
          />
        </div>
        <div>
          <Label htmlFor="roomPassword">Room Password</Label>
          <Input
            id="roomPassword"
            {...register("roomPassword")}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="startTime">Start Time</Label>
        <Input
          id="startTime"
          type="datetime-local"
          {...register("startTime", { required: "Start time is required" })}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          {...register("description")}
        />
      </div>
      <div className="flex space-x-4">
        <Button
          type="submit"
          disabled={createTournamentMutation.isPending || updateTournamentMutation.isPending}
          className="bg-red-500 hover:bg-red-600"
        >
          {isEdit ? "Update Tournament" : "Create Tournament"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setEditModalOpen(false);
              setSelectedTournament(null);
            } else {
              setCreateModalOpen(false);
            }
            reset();
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tournament Management</h1>
          <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Tournament
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Tournament</DialogTitle>
              </DialogHeader>
              <TournamentForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tournaments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Tournaments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading tournaments...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Game</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Prize Pool</TableHead>
                    <TableHead>Entry Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTournaments.map((tournament: Tournament) => (
                    <TableRow key={tournament.id}>
                      <TableCell className="font-medium">{tournament.title}</TableCell>
                      <TableCell>{tournament.game}</TableCell>
                      <TableCell className="capitalize">{tournament.mode}</TableCell>
                      <TableCell>
                        {tournament.currentParticipants}/{tournament.maxParticipants}
                      </TableCell>
                      <TableCell>₹{tournament.prizePool}</TableCell>
                      <TableCell>₹{tournament.entryFee}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(tournament.status)} text-white`}>
                          {tournament.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(tournament.startTime).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(tournament)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(tournament)}
                            disabled={tournament.status === "live"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Tournament</DialogTitle>
            </DialogHeader>
            <TournamentForm isEdit />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
