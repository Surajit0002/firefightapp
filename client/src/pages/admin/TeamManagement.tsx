import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Eye, Trash2, Users, Trophy, Flag, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Team } from "@shared/schema";
import { COUNTRIES } from "@/lib/constants";

export default function TeamManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["/api/teams"],
    enabled: !!user?.isAdmin,
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: [`/api/teams/${selectedTeam?.id}/members`],
    enabled: !!selectedTeam?.id,
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/teams/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({
        title: "Success",
        description: "Team deleted successfully!",
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

  const handleViewTeam = (team: Team) => {
    setSelectedTeam(team);
    setViewModalOpen(true);
  };

  const handleDeleteTeam = (team: Team) => {
    if (confirm(`Are you sure you want to delete team "${team.name}"?`)) {
      deleteTeamMutation.mutate(team.id);
    }
  };

  const copyJoinCode = (joinCode: string) => {
    navigator.clipboard.writeText(joinCode);
    toast({
      title: "Copied",
      description: "Join code copied to clipboard!",
    });
  };

  const filteredTeams = teams.filter((team: Team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = countryFilter === "all" || team.country === countryFilter;
    return matchesSearch && matchesCountry;
  });

  const getWinRate = (team: Team) => {
    if (team.matches === 0) return 0;
    return Math.round(((team.wins || 0) / (team.matches || 1)) * 100);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Team Management</h1>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Total Teams: {teams.length}
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search teams by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {teams.length}
              </div>
              <div className="text-sm text-gray-600">Total Teams</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-500">
                {teams.filter((t: Team) => (t.wins || 0) > 0).length}
              </div>
              <div className="text-sm text-gray-600">Teams with Wins</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-500">
                {Math.round(teams.reduce((acc, team) => acc + (team.wins || 0), 0) / teams.length) || 0}
              </div>
              <div className="text-sm text-gray-600">Avg Wins per Team</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-500">
                {teams.filter((t: Team) => new Date(t.createdAt!).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length}
              </div>
              <div className="text-sm text-gray-600">New This Week</div>
            </CardContent>
          </Card>
        </div>

        {/* Teams Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Teams</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading teams...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Join Code</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Wins</TableHead>
                    <TableHead>Matches</TableHead>
                    <TableHead>Win Rate</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.map((team: Team) => {
                    const country = COUNTRIES.find(c => c.code === team.country);
                    const winRate = getWinRate(team);
                    
                    return (
                      <TableRow key={team.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                              {team.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{team.name}</div>
                              <div className="text-sm text-gray-600">
                                Team ID: {team.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Flag className="w-4 h-4 text-gray-400" />
                            <span>{country ? `${country.flag} ${country.name}` : team.country || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {team.joinCode}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyJoinCode(team.joinCode)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{team.maxPlayers || 6} max</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{team.wins || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>{team.matches || 0}</TableCell>
                        <TableCell>
                          <Badge variant={winRate >= 60 ? "default" : winRate >= 30 ? "secondary" : "outline"}>
                            {winRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(team.createdAt!).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewTeam(team)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteTeam(team)}
                            >
                              <Trash2 className="w-4 h-4" />
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

        {/* View Team Modal */}
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Team Details</DialogTitle>
            </DialogHeader>
            {selectedTeam && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {selectedTeam.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedTeam.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Join Code: {selectedTeam.joinCode}</span>
                      <span>•</span>
                      <span>Created: {new Date(selectedTeam.createdAt!).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-500">{selectedTeam.wins || 0}</div>
                      <div className="text-sm text-gray-600">Wins</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-500">{selectedTeam.matches || 0}</div>
                      <div className="text-sm text-gray-600">Matches</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-500">{getWinRate(selectedTeam)}%</div>
                      <div className="text-sm text-gray-600">Win Rate</div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Team Members</h3>
                  <div className="space-y-3">
                    {teamMembers.map((member: any) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-red-500 text-white">
                              {member.user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.user.username}</div>
                            <div className="text-sm text-gray-600">{member.user.email}</div>
                          </div>
                        </div>
                        <Badge variant={member.role === "captain" ? "default" : "outline"}>
                          {member.role}
                        </Badge>
                      </div>
                    ))}
                    {teamMembers.length === 0 && (
                      <div className="text-center py-4 text-gray-600">
                        No members found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
