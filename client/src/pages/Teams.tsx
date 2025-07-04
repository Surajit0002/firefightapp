import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamCard from "@/components/TeamCard";
import CreateTeamModal from "@/components/modals/CreateTeamModal";
import { Team } from "@shared/schema";
import { Plus, Users, Search } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Teams() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);

  const { data: allTeams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const { data: userTeams } = useQuery<Team[]>({
    queryKey: ["/api/users", user?.id, "teams"],
    enabled: !!user?.id,
  });

  const joinTeamMutation = useMutation({
    mutationFn: async (joinCode: string) => {
      if (!user) throw new Error("User not authenticated");
      
      return apiRequest("POST", "/api/teams/join-by-code", {
        joinCode,
        userId: user.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Successfully joined the team",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "teams"] });
      setJoinCode("");
      setShowJoinInput(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join team",
        variant: "destructive",
      });
    },
  });

  const handleJoinTeam = () => {
    if (!joinCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid join code",
        variant: "destructive",
      });
      return;
    }
    joinTeamMutation.mutate(joinCode.trim());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Teams</h1>
        <div className="flex space-x-4">
          <Button
            className="bg-red-500 hover:bg-red-600"
            onClick={() => setCreateTeamModalOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Team
          </Button>
          <Button
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
            onClick={() => setShowJoinInput(!showJoinInput)}
          >
            <Users className="w-5 h-5 mr-2" />
            Join Team
          </Button>
        </div>
      </div>

      {/* Join Team Input */}
      {showJoinInput && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold mb-3">Join Team by Code</h3>
          <div className="flex space-x-3">
            <Input
              placeholder="Enter team join code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleJoinTeam}
              disabled={joinTeamMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {joinTeamMutation.isPending ? "Joining..." : "Join"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowJoinInput(false);
                setJoinCode("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="my-teams" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-teams">My Teams</TabsTrigger>
          <TabsTrigger value="global-teams">Global Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="my-teams" className="space-y-6">
          {userTeams && userTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onEdit={() => {}}
                  onView={() => {}}
                  onAddMember={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Teams Yet</h3>
              <p className="text-gray-500 mb-6">Create your first team or join an existing one to get started.</p>
              <div className="flex justify-center space-x-4">
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => setCreateTeamModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowJoinInput(true)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Join Team
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="global-teams" className="space-y-6">
          {allTeams && allTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onEdit={() => {}}
                  onView={() => {}}
                  onAddMember={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No teams found</div>
              <p className="text-gray-400">Be the first to create a team!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateTeamModal
        open={createTeamModalOpen}
        onOpenChange={setCreateTeamModalOpen}
      />
    </div>
  );
}
