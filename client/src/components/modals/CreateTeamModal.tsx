
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
  const [playerData, setPlayerData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    gameId: "",
    profilePic: ""
  });

  const roles = [
    { value: "captain", label: "Captain" },
    { value: "player", label: "Player" },
    { value: "substitute", label: "Substitute" },
    { value: "coach", label: "Coach" }
  ];

  const games = [
    { value: "1", label: "Free Fire" },
    { value: "2", label: "PUBG Mobile" },
    { value: "3", label: "Call of Duty Mobile" },
    { value: "4", label: "Valorant" }
  ];

  const handleAddPlayer = () => {
    if (playerData.name.trim() && playerData.role && playerData.email.trim()) {
      onAddPlayer(playerData.name.trim());
      setPlayerData({
        name: "",
        role: "",
        email: "",
        phone: "",
        gameId: "",
        profilePic: ""
      });
      onOpenChange(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPlayerData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
            Add New Player
          </DialogTitle>
          <p className="text-gray-600 text-center mt-2">Fill in the player details to add them to your team</p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Picture Section - Full Width */}
          <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
            <Label className="text-lg font-semibold mb-4 block text-gray-800">Profile Picture</Label>
            <div className="relative inline-block group">
              <div className="w-28 h-28 bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg transform transition-transform group-hover:scale-105">
                <span className="text-white text-3xl font-bold">
                  {playerData.name?.charAt(0)?.toUpperCase() || "P"}
                </span>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-blue-200">
                <Upload className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 font-medium">Click to upload or drag & drop</p>
            <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
          </div>

          {/* Form Fields - 2 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Player Name */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Label htmlFor="playerName" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Player Name *
                </Label>
                <Input
                  id="playerName"
                  value={playerData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter full name"
                  className="mt-2 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg"
                />
              </div>

              {/* Email */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Label htmlFor="playerEmail" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Email Address *
                </Label>
                <Input
                  id="playerEmail"
                  type="email"
                  value={playerData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="player@example.com"
                  className="mt-2 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg"
                />
              </div>

              {/* Phone */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Label htmlFor="playerPhone" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Phone Number
                </Label>
                <Input
                  id="playerPhone"
                  type="tel"
                  value={playerData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 9876543210"
                  className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Player Role */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Label htmlFor="playerRole" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Player Role *
                </Label>
                <Select value={playerData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger className="mt-2 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg">
                    <SelectValue placeholder="Choose role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value} className="hover:bg-red-50">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            role.value === 'captain' ? 'bg-red-500' : 
                            role.value === 'player' ? 'bg-blue-500' : 
                            role.value === 'substitute' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <span>{role.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              

              {/* Game ID */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Label htmlFor="gameUserId" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Game ID
                </Label>
                <Input
                  id="gameUserId"
                  value={playerData.gameId}
                  onChange={(e) => handleInputChange("gameId", e.target.value)}
                  placeholder="Enter game user ID"
                  className="mt-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="flex-1 py-3 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl transition-all duration-200"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 py-3 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
              onClick={handleAddPlayer}
              disabled={!playerData.name.trim() || !playerData.role || !playerData.email.trim()}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Player to Team
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
