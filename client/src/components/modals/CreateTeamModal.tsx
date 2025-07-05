
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

            {/* Team Info Display */}
            {form.watch("name") && selectedCountry && (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {form.watch("name").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{form.watch("name")}</h3>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-sm text-gray-600">{selectedCountry.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Team Members */}
            <div>
              <Label className="text-lg font-medium mb-4 block">Team Members (Max 6)</Label>
              <div className="space-y-3">
                {/* Captain */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{user?.username} (You)</div>
                      <div className="text-sm text-gray-600">Captain</div>
                    </div>
                  </div>
                </div>

                {/* Additional Players */}
                {additionalPlayers.map((player, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {player.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold">{player}</div>
                          <div className="text-sm text-gray-600">Member</div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePlayer(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Add Player Button */}
                {additionalPlayers.length < 5 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-gray-400 hover:text-gray-600 flex items-center justify-center space-x-2"
                      onClick={() => setAddPlayerModalOpen(true)}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Player</span>
                    </Button>
                  </div>
                )}
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
