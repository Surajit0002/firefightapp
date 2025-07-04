import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Smartphone, Wallet } from "lucide-react";

interface AddMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddMoneyModal({ open, onOpenChange }: AddMoneyModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("upi");

  const quickAmounts = [100, 250, 500, 1000, 2000, 5000];

  const addMoneyMutation = useMutation({
    mutationFn: async () => {
      if (!user || !amount) throw new Error("Missing user or amount");
      
      return apiRequest("POST", "/api/wallet/add-money", {
        userId: user.id,
        amount: amount,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: `₹${amount} added to your wallet`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "transactions"] });
      onOpenChange(false);
      setAmount("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add money",
        variant: "destructive",
      });
    },
  });

  const handleAddMoney = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    addMoneyMutation.mutate();
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: Smartphone, description: "Google Pay, PhonePe, Paytm" },
    { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard" },
    { id: "wallet", name: "Digital Wallet", icon: Wallet, description: "Paytm, Mobikwik" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Money</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="text-lg"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-3 block">Quick Add</Label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(quickAmount)}
                  className="hover:bg-red-50 hover:border-red-500"
                >
                  ₹{quickAmount}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-3 block">Payment Method</Label>
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedMethod === method.id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div className="flex-1">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                      {selectedMethod === method.id && (
                        <Badge className="bg-red-500">Selected</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {amount && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount to add:</span>
                <span className="text-lg font-bold text-red-500">₹{amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Processing fee:</span>
                <span className="text-sm">Free</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-lg font-bold">₹{amount}</span>
              </div>
            </div>
          )}
          
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={handleAddMoney}
              disabled={addMoneyMutation.isPending || !amount}
            >
              {addMoneyMutation.isPending ? "Processing..." : "Add Money"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
