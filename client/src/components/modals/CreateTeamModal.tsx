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
import { Upload } from "lucide-react";

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

export default function CreateTeamModal({ open, onOpenChange }: CreateTeamModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateTeamForm>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      country: "",
      logo: "",
    },
  });

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
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Team</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter team name"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="country">Country</Label>
              <Select value={form.watch("country")} onValueChange={(value) => form.setValue("country", value)}>
                <SelectTrigger>
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
          
          <div>
            <Label>Team Logo</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 2MB</p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2">Team Members (Max 6)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
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
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm">Add Player</span>
                </button>
              </div>
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
  );
}
