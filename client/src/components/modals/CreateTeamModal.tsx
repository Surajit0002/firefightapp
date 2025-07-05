
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { countries } from "@/lib/countries";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, Plus, X } from "lucide-react";

const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  country: z.string().min(1, "Country is required"),
  logo: z.string().optional(),
});

type CreateTeamForm = z.infer<typeof createTeamSchema>;

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AddPlayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPlayer: (playerName: string) => void;
}

function AddPlayerModal({ open, onOpenChange, onAddPlayer }: AddPlayerModalProps) {
  const [playerName, setPlayerName] = useState("");

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      onAddPlayer(playerName.trim());
      setPlayerName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-4">
        <DialogHeader>
          <DialogTitle>Add Player</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="playerName">Player Name</Label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600"
              onClick={handleAddPlayer}
            >
              Add Player
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CreateTeamModal({ open, onOpenChange }: CreateTeamModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addPlayerModalOpen, setAddPlayerModalOpen] = useState(false);
  const [additionalPlayers, setAdditionalPlayers] = useState<string[]>([]);

  const form = useForm<CreateTeamForm>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      country: "",
      logo: "",
    },
  });

  const selectedCountry = countries.find(c => c.code === form.watch("country"));

  const createTeamMutation = useMutation({
    mutationFn: async (data: CreateTeamForm) => {
      if (!user) throw new Error("User not authenticated");
      
      return apiRequest("POST", "/api/teams", {
        ...data,
        captainId: user.id,
        maxMembers: 6,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Team created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "teams"] });
      onOpenChange(false);
      form.reset();
      setAdditionalPlayers([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateTeamForm) => {
    createTeamMutation.mutate(data);
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
    setAdditionalPlayers([]);
  };

  const handleAddPlayer = (playerName: string) => {
    if (additionalPlayers.length < 5) {
      setAdditionalPlayers([...additionalPlayers, playerName]);
    }
  };

  const handleRemovePlayer = (index: number) => {
    setAdditionalPlayers(additionalPlayers.filter((_, i) => i !== index));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create Team</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Team Logo at Top */}
            <div className="text-center">
              <Label className="text-lg font-medium mb-4 block">Team Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl font-bold">
                    {form.watch("name")?.charAt(0)?.toUpperCase() || "T"}
                  </span>
                </div>
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 text-sm">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
              </div>
            </div>

            {/* Team Name and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-lg font-medium">Team Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Enter team name"
                  className="mt-2"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="country" className="text-lg font-medium">Country</Label>
                <Select value={form.watch("country")} onValueChange={(value) => form.setValue("country", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center space-x-2">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.country.message}
                  </p>
                )}
              </div>
            </div>

            {/* Add Player Button */}
            <div className="flex justify-center">
              <Button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2"
                onClick={() => setAddPlayerModalOpen(true)}
                disabled={additionalPlayers.length >= 5}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
            </div>
            
            {/* Team Members Grid */}
            <div>
              <Label className="text-lg font-medium mb-4 block">Team Members ({1 + additionalPlayers.length}/6)</Label>
              <div className="grid grid-cols-3 gap-3">
                {/* Captain */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-3 text-center relative">
                  <div className="absolute top-1 right-1">
                    <Badge className="bg-red-500 text-white text-xs px-1 py-0.5">Captain</Badge>
                  </div>
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-sm font-bold">
                      {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="font-semibold text-gray-800 text-sm truncate">{user?.username || "You"}</div>
                  <div className="text-xs text-gray-600">Captain</div>
                </div>

                {/* Additional Players */}
                {additionalPlayers.map((player, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-3 text-center relative">
                    <div className="absolute top-1 right-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePlayer(index)}
                        className="text-red-500 hover:text-red-700 p-0.5 h-auto w-auto"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-sm font-bold">
                        {player.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-800 text-sm truncate">{player}</div>
                    <div className="text-xs text-gray-600">Member</div>
                  </div>
                ))}
                
                {/* Empty Slots */}
                {Array.from({ length: Math.max(0, 5 - additionalPlayers.length) }).map((_, index) => (
                  <div key={`empty-${index}`} className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center flex flex-col items-center justify-center bg-gray-50">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-xs text-gray-500">Empty Slot</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-red-500 hover:bg-red-600"
                disabled={createTeamMutation.isPending}
              >
                {createTeamMutation.isPending ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AddPlayerModal
        open={addPlayerModalOpen}
        onOpenChange={setAddPlayerModalOpen}
        onAddPlayer={handleAddPlayer}
      />
    </>
  );
}
