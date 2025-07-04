import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, MessageSquare, Mail, Phone, Search, FileText, Shield, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Help() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    priority: "",
    message: "",
  });

  const faqs = [
    {
      id: "1",
      question: "How do I join a tournament?",
      answer: "To join a tournament, go to the Tournaments page, select the tournament you want to participate in, and click 'Join Tournament'. Make sure you have sufficient balance in your wallet for the entry fee.",
      category: "tournaments"
    },
    {
      id: "2", 
      question: "How do I add money to my wallet?",
      answer: "Go to your Wallet page and click 'Add Money'. Choose your payment method (UPI, Credit/Debit Card, or Digital Wallet) and enter the amount you want to add. Follow the payment process to complete the transaction.",
      category: "wallet"
    },
    {
      id: "3",
      question: "How do I create a team?",
      answer: "Visit the Teams page and click 'Create Team'. Fill in your team name, select your country, upload a team logo (optional), and add team members. You can invite up to 6 members to your team.",
      category: "teams"
    },
    {
      id: "4",
      question: "What happens if I win a tournament?",
      answer: "When you win a tournament, the prize money is automatically credited to your wallet. You'll receive a notification and can see the transaction in your wallet history.",
      category: "tournaments"
    },
    {
      id: "5",
      question: "How do I withdraw money from my wallet?",
      answer: "Go to your Wallet page and click 'Withdraw'. Enter the amount you want to withdraw and provide your bank details or UPI ID. Withdrawals are processed within 24-48 hours.",
      category: "wallet"
    },
    {
      id: "6",
      question: "Can I cancel my tournament participation?",
      answer: "Tournament participation cannot be cancelled once confirmed. The entry fee will not be refunded. Make sure you can participate before joining any tournament.",
      category: "tournaments"
    },
    {
      id: "7",
      question: "How does the referral program work?",
      answer: "Share your referral code with friends. When they sign up using your code and play their first tournament, you earn ₹50 and they get ₹25 bonus. Go to Referral page to get your code.",
      category: "referral"
    },
    {
      id: "8",
      question: "What if I face technical issues during a match?",
      answer: "If you experience technical issues during a live match, immediately contact support with match details and screenshots. Our team will investigate and provide appropriate resolution.",
      category: "technical"
    }
  ];

  const categories = [
    { id: "tournaments", name: "Tournaments", icon: HelpCircle },
    { id: "wallet", name: "Wallet & Payments", icon: DollarSign },
    { id: "teams", name: "Teams", icon: Shield },
    { id: "technical", name: "Technical Issues", icon: FileText },
    { id: "referral", name: "Referral Program", icon: MessageSquare },
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would submit the ticket to your API
    toast({
      title: "Ticket Submitted",
      description: "Your support ticket has been submitted. We'll get back to you soon!",
    });

    setTicketForm({
      subject: "",
      category: "",
      priority: "",
      message: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-gray-600">Get help with your Fire Fight gaming experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Support Options */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
              <div className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Live Chat
                  <Badge className="ml-auto bg-green-500">Online</Badge>
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Support Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday:</span>
                  <span className="font-semibold">9:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday - Sunday:</span>
                  <span className="font-semibold">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-semibold text-green-600">&lt; 2 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* FAQ Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const count = faqs.filter(faq => faq.category === category.id).length;
              return (
                <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Icon className="w-8 h-8 mx-auto mb-2 text-red-500" />
                    <h4 className="font-semibold text-sm">{category.name}</h4>
                    <p className="text-xs text-gray-500">{count} articles</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">Frequently Asked Questions</h3>
              
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500">No FAQ found for your search.</div>
                  <p className="text-gray-400">Try different keywords or submit a support ticket.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Ticket */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">Submit Support Ticket</h3>
              
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={ticketForm.category} 
                      onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tournament">Tournament Issues</SelectItem>
                        <SelectItem value="wallet">Wallet & Payments</SelectItem>
                        <SelectItem value="team">Team Management</SelectItem>
                        <SelectItem value="technical">Technical Issues</SelectItem>
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={ticketForm.priority} 
                    onValueChange={(value) => setTicketForm(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your issue in detail..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="bg-red-500 hover:bg-red-600">
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
