import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Ban, 
  CheckCircle, 
  XCircle,
  Crown,
  Wallet,
  Trophy,
  Users as UsersIcon,
  MoreVertical
} from "lucide-react";
import { formatCurrency, formatDate, getCountryFlag } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest('PUT', `/api/users/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success!",
        description: "User updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const handleToggleUserStatus = (user: any) => {
    updateUserMutation.mutate({
      id: user.id,
      data: { isActive: !user.isActive }
    });
  };

  const handleToggleAdminStatus = (user: any) => {
    updateUserMutation.mutate({
      id: user.id,
      data: { isAdmin: !user.isAdmin }
    });
  };

  const viewUserDetails = (user: any) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === "active") matchesStatus = user.isActive;
    if (statusFilter === "inactive") matchesStatus = !user.isActive;
    if (statusFilter === "admin") matchesStatus = user.isAdmin;
    
    return matchesSearch && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u: any) => u.isActive).length;
  const adminUsers = users.filter((u: any) => u.isAdmin).length;
  const totalWalletBalance = users.reduce((sum: number, u: any) => sum + (u.walletBalance || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-fire-red">{totalUsers}</p>
              </div>
              <UsersIcon className="w-8 h-8 text-fire-red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Users</p>
                <p className="text-3xl font-bold text-fire-yellow">{adminUsers}</p>
              </div>
              <Crown className="w-8 h-8 text-fire-yellow" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-3xl font-bold text-fire-blue">{formatCurrency(totalWalletBalance)}</p>
              </div>
              <Wallet className="w-8 h-8 text-fire-blue" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users..."
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
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg animate-pulse">
                  <div className="w-full h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">No users match your search criteria.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-fire-red text-white">
                            {user.fullName.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold flex items-center space-x-2">
                            <span>{user.fullName}</span>
                            {user.isAdmin && (
                              <Crown className="w-4 h-4 text-fire-yellow" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">@{user.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{user.email}</div>
                        <div className="text-sm text-gray-600 flex items-center space-x-1">
                          <span>{getCountryFlag(user.country)}</span>
                          <span>{user.country}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {user.isAdmin && (
                          <Badge className="bg-fire-yellow text-white">
                            Admin
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-3 h-3 text-fire-yellow" />
                          <span>{user.totalWins} wins</span>
                        </div>
                        <div className="text-gray-600">{user.totalMatches} matches</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-semibold">{formatCurrency(user.walletBalance || 0)}</div>
                        <div className="text-gray-600">{user.bonusCoins || 0} coins</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => viewUserDetails(user)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleUserStatus(user)}
                          className={user.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                        >
                          {user.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </Button>
                        {!user.isAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleAdminStatus(user)}
                            className="text-fire-yellow hover:text-fire-yellow/80"
                          >
                            <Crown className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="bg-fire-red text-white text-xl">
                    {selectedUser.fullName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold flex items-center space-x-2">
                    <span>{selectedUser.fullName}</span>
                    {selectedUser.isAdmin && <Crown className="w-5 h-5 text-fire-yellow" />}
                  </h3>
                  <p className="text-gray-600">@{selectedUser.username}</p>
                  <Badge className={selectedUser.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {selectedUser.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Email:</strong> {selectedUser.email}</div>
                    <div><strong>Phone:</strong> {selectedUser.phone || 'Not provided'}</div>
                    <div className="flex items-center space-x-1">
                      <strong>Country:</strong>
                      <span>{getCountryFlag(selectedUser.country)}</span>
                      <span>{selectedUser.country}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Account Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>User ID:</strong> #{selectedUser.id}</div>
                    <div><strong>Referral Code:</strong> {selectedUser.referralCode}</div>
                    <div><strong>Joined:</strong> {formatDate(selectedUser.createdAt)}</div>
                    <div><strong>Role:</strong> {selectedUser.isAdmin ? 'Administrator' : 'User'}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Gaming Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Total Wins:</strong> {selectedUser.totalWins}</div>
                    <div><strong>Total Matches:</strong> {selectedUser.totalMatches}</div>
                    <div><strong>Current Rank:</strong> {selectedUser.currentRank || 'Unranked'}</div>
                    <div><strong>Win Rate:</strong> {selectedUser.totalMatches > 0 ? ((selectedUser.totalWins / selectedUser.totalMatches) * 100).toFixed(1) : 0}%</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Wallet Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Cash Balance:</strong> {formatCurrency(selectedUser.walletBalance || 0)}</div>
                    <div><strong>Bonus Coins:</strong> {selectedUser.bonusCoins || 0}</div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleToggleUserStatus(selectedUser)}
                  className={selectedUser.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {selectedUser.isActive ? "Suspend User" : "Activate User"}
                </Button>
                {!selectedUser.isAdmin && (
                  <Button
                    onClick={() => handleToggleAdminStatus(selectedUser)}
                    className="bg-fire-yellow hover:bg-fire-yellow/90"
                  >
                    Make Admin
                  </Button>
                )}
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
