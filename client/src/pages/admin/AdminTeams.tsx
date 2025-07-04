import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Eye, 
  Trash2, 
  Users, 
  Trophy,
  Calendar,
  Copy,
  Shield
} from "lucide-react";
import { formatDate, getCountryFlag } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function AdminTeams() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch teams
  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ["/api/teams"],
  });

  // Fetch users for team member details
  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  const viewTeamDetails = async (team: any) => {
    try {
      // Fetch team members when viewing details
      const response = await fetch(`/api/teams/${team.id}/members`);
      const members = await response.json();
      
      setSelectedTeam({ ...team, members });
      setIsDetailsModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch team details",
        variant: "destructive",
      });
    }
  };

  const copyJoinCode = (joinCode: string) => {
    navigator.clipboard.writeText(joinCode);
    toast({
      title: "Copied!",
      description: "Join code copied to clipboard",
    });
  };

  const filteredTeams = teams.filter((team: any) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTeams = teams.length;
  const activeTeams = teams.filter((t: any) => t.isActive).length;
  const totalMatches = teams.reduce((sum: number, t: any) => sum + (t.totalMatches || 0), 0);
  const totalWins = teams.reduce((sum: number, t: any) => sum + (t.totalWins || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teams</p>
                <p className="text-3xl font-bold text-fire-red">{totalTeams}</p>
              </div>
              <Shield className="w-8 h-8 text-fire-red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Teams</p>
                <p className="text-3xl font-bold text-green-600">{activeTeams}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Matches</p>
                <p className="text-3xl font-bold text-fire-blue">{totalMatches}</p>
              </div>
              <Trophy className="w-8 h-8 text-fire-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Wins</p>
                <p className="text-3xl font-bold text-fire-yellow">{totalWins}</p>
              </div>
              <Trophy className="w-8 h-8 text-fire-yellow" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Teams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teams ({filteredTeams.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {teamsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg animate-pulse">
                  <div className="w-full h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams found</h3>
              <p className="text-gray-600">No teams match your search criteria.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Captain</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Join Code</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team: any) => {
                  const captain = users.find((u: any) => u.id === team.captainId);
                  return (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={team.logo} />
                            <AvatarFallback className="bg-gradient-to-r from-fire-red to-fire-yellow text-white font-bold">
                              {team.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{team.name}</div>
                            <div className="text-sm text-gray-600 flex items-center space-x-1">
                              <span>{getCountryFlag(team.country)}</span>
                              <span>{team.country}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {captain && (
                          <div>
                            <div className="font-semibold">{captain.fullName}</div>
                            <div className="text-sm text-gray-600">{captain.email}</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Current: {/* Team member count would come from members */}</div>
                          <div className="text-gray-600">Max: {team.maxMembers}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center space-x-1">
                            <Trophy className="w-3 h-3 text-fire-yellow" />
                            <span>{team.totalWins} wins</span>
                          </div>
                          <div className="text-gray-600">{team.totalMatches} matches</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {team.joinCode}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyJoinCode(team.joinCode)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {formatDate(team.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => viewTeamDetails(team)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
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

      {/* Team Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Team Details</DialogTitle>
          </DialogHeader>
          {selectedTeam && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedTeam.logo} />
                  <AvatarFallback className="bg-gradient-to-r from-fire-red to-fire-yellow text-white text-xl font-bold">
                    {selectedTeam.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedTeam.name}</h3>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span>{getCountryFlag(selectedTeam.country)}</span>
                    <span>{selectedTeam.country}</span>
                  </div>
                  <Badge className={selectedTeam.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {selectedTeam.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Team Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Team ID:</strong> #{selectedTeam.id}</div>
                    <div><strong>Join Code:</strong> {selectedTeam.joinCode}</div>
                    <div><strong>Created:</strong> {formatDate(selectedTeam.createdAt)}</div>
                    <div><strong>Max Members:</strong> {selectedTeam.maxMembers}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Performance Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Total Wins:</strong> {selectedTeam.totalWins}</div>
                    <div><strong>Total Matches:</strong> {selectedTeam.totalMatches}</div>
                    <div><strong>Current Rank:</strong> {selectedTeam.currentRank || 'Unranked'}</div>
                    <div><strong>Win Rate:</strong> {selectedTeam.totalMatches > 0 ? ((selectedTeam.totalWins / selectedTeam.totalMatches) * 100).toFixed(1) : 0}%</div>
                  </div>
                </div>
              </div>

              {selectedTeam.members && (
                <div>
                  <h4 className="font-semibold mb-4">Team Members ({selectedTeam.members.length}/{selectedTeam.maxMembers})</h4>
                  <div className="space-y-3">
                    {selectedTeam.members.map((member: any) => (
                      <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.user.avatar} />
                          <AvatarFallback className="bg-fire-red text-white">
                            {member.user.fullName.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{member.user.fullName}</div>
                          <div className="text-sm text-gray-600">{member.user.email}</div>
                        </div>
                        <Badge variant="outline" className={member.role === 'captain' ? 'border-fire-red text-fire-red' : ''}>
                          {member.role}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          {formatDate(member.joinedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  className={selectedTeam.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {selectedTeam.isActive ? "Suspend Team" : "Activate Team"}
                </Button>
                <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
