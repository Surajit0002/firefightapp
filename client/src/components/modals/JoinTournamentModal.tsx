import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tournament, Team } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface JoinTournamentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournament: Tournament | null;
}

export default function JoinTournamentModal({ open, onOpenChange, tournament }: JoinTournamentModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { data: userTeams } = useQuery({
    queryKey: ["/api/users", user?.id, "teams"],
    enabled: !!user?.id && open,
  });

  const joinTournamentMutation = useMutation({
    mutationFn: async () => {
      if (!tournament || !user) throw new Error("Missing tournament or user");
      
      return apiRequest("POST", `/api/tournaments/${tournament.id}/join`, {
        userId: user.id,
        teamId: selectedTeamId ? parseInt(selectedTeamId) : null,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Successfully joined the tournament",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id] });
      onOpenChange(false);
      setSelectedTeamId("");
      setAgreedToTerms(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join tournament",
        variant: "destructive",
      });
    },
  });

  const handleJoin = () => {
    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    joinTournamentMutation.mutate();
  };

  if (!tournament || !user) return null;

  const entryFee = parseFloat(tournament.entryFee);
  const userBalance = parseFloat(user.walletBalance);
  const hasInsufficientFunds = userBalance < entryFee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Join Tournament</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Tournament Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Entry Fee:</span>
                <span className="font-semibold">₹{tournament.entryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Prize Pool:</span>
                <span className="font-semibold text-red-500">₹{tournament.prizePool}</span>
              </div>
              <div className="flex justify-between">
                <span>Your Balance:</span>
                <span className={`font-semibold ${hasInsufficientFunds ? "text-red-500" : "text-green-600"}`}>
                  ₹{user.walletBalance}
                </span>
              </div>
            </div>
          </div>
          
          {tournament.mode !== "solo" && (
            <div>
              <label className="block text-sm font-medium mb-2">Select Team</label>
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a team or create new" />
                </SelectTrigger>
                <SelectContent>
                  {userTeams?.map((team: Team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="create-new">Create New Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms-checkbox"
              checked={agreedToTerms}
              onCheckedChange={setAgreedToTerms}
            />
            <label htmlFor="terms-checkbox" className="text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-red-500 hover:underline">
                terms and conditions
              </a>
            </label>
          </div>
          
          {hasInsufficientFunds && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">
                Insufficient balance. Please add money to your wallet first.
              </p>
            </div>
          )}
          
          <Button
            className="w-full bg-red-500 hover:bg-red-600"
            onClick={handleJoin}
            disabled={joinTournamentMutation.isPending || hasInsufficientFunds || !agreedToTerms}
          >
            {joinTournamentMutation.isPending ? "Joining..." : "Join Tournament"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
