import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  AlertCircle,
  Eye
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminWallet() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch all transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/admin/transactions"],
  });

  // Fetch users for transaction details
  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  // Approve withdrawal mutation
  const approveWithdrawalMutation = useMutation({
    mutationFn: async (transactionId: number) => {
      // Update transaction status to completed
      const response = await apiRequest('PUT', `/api/wallet/transactions/${transactionId}`, {
        status: 'completed'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      toast({
        title: "Success!",
        description: "Withdrawal approved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve withdrawal",
        variant: "destructive",
      });
    },
  });

  // Reject withdrawal mutation
  const rejectWithdrawalMutation = useMutation({
    mutationFn: async (transactionId: number) => {
      const response = await apiRequest('PUT', `/api/wallet/transactions/${transactionId}`, {
        status: 'failed'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      toast({
        title: "Withdrawal Rejected",
        description: "Withdrawal request has been rejected",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject withdrawal",
        variant: "destructive",
      });
    },
  });

  const handleApproveWithdrawal = (transactionId: number) => {
    approveWithdrawalMutation.mutate(transactionId);
  };

  const handleRejectWithdrawal = (transactionId: number) => {
    rejectWithdrawalMutation.mutate(transactionId);
  };

  const viewTransactionDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'withdrawal':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'tournament_entry':
        return <TrendingDown className="w-5 h-5 text-blue-600" />;
      case 'tournament_win':
        return <TrendingUp className="w-5 h-5 text-yellow-600" />;
      case 'referral_bonus':
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredTransactions = transactions.filter((transaction: any) => {
    const user = users.find((u: any) => u.id === transaction.userId);
    const matchesSearch = user?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate stats
  const totalDeposits = transactions
    .filter((t: any) => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter((t: any) => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const pendingWithdrawals = transactions
    .filter((t: any) => t.type === 'withdrawal' && t.status === 'pending')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const totalRevenue = transactions
    .filter((t: any) => t.type === 'tournament_entry')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const pendingWithdrawalTransactions = transactions.filter((t: any) => t.type === 'withdrawal' && t.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deposits</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(totalDeposits)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Withdrawals</p>
                <p className="text-3xl font-bold text-red-600">{formatCurrency(totalWithdrawals)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Withdrawals</p>
                <p className="text-3xl font-bold text-orange-600">{formatCurrency(pendingWithdrawals)}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                <p className="text-3xl font-bold text-fire-red">{formatCurrency(totalRevenue * 0.1)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-fire-red" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Withdrawals Alert */}
      {pendingWithdrawalTransactions.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">Pending Withdrawal Approvals</p>
                <p className="text-sm text-orange-700">
                  {pendingWithdrawalTransactions.length} withdrawal request{pendingWithdrawalTransactions.length !== 1 ? 's' : ''} 
                  totaling {formatCurrency(pendingWithdrawals)} require your approval.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="pending">Pending Approvals ({pendingWithdrawalTransactions.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="flex space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="tournament_entry">Tournament Entry</SelectItem>
                <SelectItem value="tournament_win">Tournament Win</SelectItem>
                <SelectItem value="referral_bonus">Referral Bonus</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg animate-pulse">
                      <div className="w-full h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
                  <p className="text-gray-600">No transactions match your search criteria.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction: any) => {
                      const user = users.find((u: any) => u.id === transaction.userId);
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {user && (
                              <div>
                                <div className="font-semibold">{user.fullName}</div>
                                <div className="text-sm text-gray-600">{user.email}</div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getTransactionIcon(transaction.type)}
                              <span className="capitalize">{transaction.type.replace('_', ' ')}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`font-semibold ${
                              transaction.type === 'withdrawal' || transaction.type === 'tournament_entry' 
                                ? 'text-red-600' 
                                : 'text-green-600'
                            }`}>
                              {transaction.type === 'withdrawal' || transaction.type === 'tournament_entry' ? '-' : '+'}
                              {formatCurrency(transaction.amount)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(transaction.status)}
                              <Badge className={
                                transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                transaction.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {transaction.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate" title={transaction.description}>
                              {transaction.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              {formatDate(transaction.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => viewTransactionDetails(transaction)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              {transaction.type === 'withdrawal' && transaction.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleApproveWithdrawal(transaction.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleRejectWithdrawal(transaction.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
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
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Withdrawal Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingWithdrawalTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-600">No pending withdrawal requests to review.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingWithdrawalTransactions.map((transaction: any) => {
                    const user = users.find((u: any) => u.id === transaction.userId);
                    return (
                      <div key={transaction.id} className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <TrendingDown className="w-5 h-5 text-red-600" />
                              <div>
                                <div className="font-semibold">{user?.fullName}</div>
                                <div className="text-sm text-gray-600">{user?.email}</div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              <strong>Amount:</strong> {formatCurrency(transaction.amount)}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              <strong>Description:</strong> {transaction.description}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Requested:</strong> {formatDate(transaction.createdAt)}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveWithdrawal(transaction.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleRejectWithdrawal(transaction.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="text-center">
                {getTransactionIcon(selectedTransaction.type)}
                <div className="mt-2">
                  <div className={`text-2xl font-bold ${
                    selectedTransaction.type === 'withdrawal' || selectedTransaction.type === 'tournament_entry' 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {selectedTransaction.type === 'withdrawal' || selectedTransaction.type === 'tournament_entry' ? '-' : '+'}
                    {formatCurrency(selectedTransaction.amount)}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {selectedTransaction.type.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <strong>Transaction ID:</strong> #{selectedTransaction.id}
                </div>
                <div>
                  <strong>Status:</strong>
                  <Badge className={
                    selectedTransaction.status === 'completed' ? 'bg-green-100 text-green-800 ml-2' :
                    selectedTransaction.status === 'pending' ? 'bg-orange-100 text-orange-800 ml-2' :
                    'bg-red-100 text-red-800 ml-2'
                  }>
                    {selectedTransaction.status}
                  </Badge>
                </div>
                <div>
                  <strong>Description:</strong> {selectedTransaction.description}
                </div>
                <div>
                  <strong>Date:</strong> {formatDate(selectedTransaction.createdAt)}
                </div>
                {selectedTransaction.transactionId && (
                  <div>
                    <strong>Payment ID:</strong> {selectedTransaction.transactionId}
                  </div>
                )}
              </div>

              <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
