import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AddMoneyModal from "@/components/modals/AddMoneyModal";
import { Transaction } from "@shared/schema";
import { 
  Wallet as WalletIcon, 
  Coins, 
  Plus, 
  ArrowUp, 
  History, 
  Gift,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Wallet() {
  const { user } = useAuth();
  const [addMoneyModalOpen, setAddMoneyModalOpen] = useState(false);

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/users", user?.id, "transactions"],
    enabled: !!user?.id,
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "tournament_win":
      case "referral_bonus":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "withdrawal":
      case "tournament_entry":
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <History className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
      case "tournament_win":
      case "referral_bonus":
        return "text-green-600";
      case "withdrawal":
      case "tournament_entry":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return num >= 0 ? `+₹${amount}` : `-₹${Math.abs(num)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wallet</h1>
      
      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-red-500 to-yellow-500 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold opacity-90">Cash Balance</h3>
                <div className="text-3xl font-bold">₹{user?.walletBalance || "0.00"}</div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <WalletIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-none"
                onClick={() => setAddMoneyModalOpen(true)}
              >
                Add Money
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-none"
              >
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold opacity-90">Bonus Coins</h3>
                <div className="text-3xl font-bold">{user?.bonusCoins || 0}</div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6" />
              </div>
            </div>
            <div className="text-sm opacity-90">
              Earned from tournaments and referrals
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent
            className="p-6 text-center"
            onClick={() => setAddMoneyModalOpen(true)}
          >
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold">Add Money</h3>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <ArrowUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold">Withdraw</h3>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3">
              <History className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold">History</h3>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <Gift className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold">Bonus</h3>
          </CardContent>
        </Card>
      </div>
      
      {/* Transaction History */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-6">Recent Transactions</h3>
          
          {transactions && transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTransactionIcon(transaction.type)}
                        <span className="capitalize">{transaction.type.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {formatAmount(transaction.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.status === "completed" ? "default" : 
                                transaction.status === "pending" ? "secondary" : "destructive"}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.createdAt!).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <History className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
              <p className="text-gray-500 mb-6">Your transaction history will appear here once you start using your wallet.</p>
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={() => setAddMoneyModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddMoneyModal
        open={addMoneyModalOpen}
        onOpenChange={setAddMoneyModalOpen}
      />
    </div>
  );
}
