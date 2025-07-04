import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText,
  Shield,
  CreditCard,
  Users,
  Trophy,
  Send,
  ExternalLink
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Help() {
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    message: "",
    email: "",
  });

  const faqData = [
    {
      category: "Getting Started",
      items: [
        {
          question: "How do I create an account?",
          answer: "Click on the 'Register' button in the top right corner and fill in your details. You'll need to provide a valid email address and phone number."
        },
        {
          question: "How do I join a tournament?",
          answer: "Browse tournaments on the Tournaments page, click on a tournament you want to join, and click the 'Join Tournament' button. Make sure you have sufficient wallet balance for the entry fee."
        },
        {
          question: "What games are supported?",
          answer: "We currently support Free Fire, PUBG, Call of Duty, Apex Legends, Valorant, and CS:GO. More games will be added based on community demand."
        }
      ]
    },
    {
      category: "Tournaments",
      items: [
        {
          question: "What are the different tournament modes?",
          answer: "We offer Solo (individual), Duo (2 players), and Squad (4+ players) modes depending on the game and tournament format."
        },
        {
          question: "How are tournament results determined?",
          answer: "Results are based on the specific game's scoring system. Typically, it includes placement, kills, and survival time. Detailed rules are provided for each tournament."
        },
        {
          question: "Can I leave a tournament after joining?",
          answer: "Once you join a tournament, you cannot leave or get a refund. Make sure you're available for the tournament time before joining."
        },
        {
          question: "What happens if I don't show up for a tournament?",
          answer: "If you don't participate in a tournament you've joined, you'll forfeit your entry fee and may receive a warning. Repeated no-shows may result in temporary restrictions."
        }
      ]
    },
    {
      category: "Teams",
      items: [
        {
          question: "How do I create a team?",
          answer: "Go to the Teams page and click 'Create Team'. Fill in your team details and invite players using the team join code."
        },
        {
          question: "How many players can be in a team?",
          answer: "Teams can have up to 6 members, allowing for substitutes in case some members are unavailable for specific tournaments."
        },
        {
          question: "Can I be in multiple teams?",
          answer: "Yes, you can join multiple teams, but you can only participate in one tournament at a time with one team."
        }
      ]
    },
    {
      category: "Wallet & Payments",
      items: [
        {
          question: "How do I add money to my wallet?",
          answer: "Go to the Wallet page and click 'Add Money'. We support UPI, credit/debit cards, and net banking for deposits."
        },
        {
          question: "How long do withdrawals take?",
          answer: "Withdrawal requests are processed within 24-48 hours during business days. The money will be transferred to your registered bank account."
        },
        {
          question: "What is the minimum withdrawal amount?",
          answer: "The minimum withdrawal amount is ₹100. There are no charges for withdrawals above ₹500."
        },
        {
          question: "Are there any fees for transactions?",
          answer: "There are no fees for deposits. Withdrawals below ₹500 have a processing fee of ₹10."
        }
      ]
    },
    {
      category: "Referral Program",
      items: [
        {
          question: "How does the referral program work?",
          answer: "Share your referral code with friends. When they sign up using your code and play their first tournament, both you and your friend get ₹50 bonus."
        },
        {
          question: "When do I receive referral bonuses?",
          answer: "Referral bonuses are credited within 24 hours after your referred friend completes their first tournament."
        },
        {
          question: "Is there a limit to referrals?",
          answer: "There's no limit to the number of people you can refer. However, self-referrals and fake accounts are strictly prohibited."
        }
      ]
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.message || !ticketForm.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Simulate ticket submission
    toast({
      title: "Ticket Submitted",
      description: "Your support ticket has been submitted. We'll get back to you within 24 hours.",
    });

    setTicketForm({
      subject: "",
      category: "",
      message: "",
      email: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Help & Support</h1>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5" />
                <span>Frequently Asked Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqData.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-lg font-semibold mb-4 fire-red">{category.category}</h3>
                    <Accordion type="single" collapsible className="w-full">
                      {category.items.map((item, itemIndex) => (
                        <AccordionItem key={itemIndex} value={`${categoryIndex}-${itemIndex}`}>
                          <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                          <AccordionContent className="text-gray-600">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-fire-red/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-fire-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Support</h3>
                    <p className="text-gray-600">support@firefight.com</p>
                    <p className="text-sm text-gray-500">Response within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-fire-blue/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-fire-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone Support</h3>
                    <p className="text-gray-600">+91 9876543210</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM IST</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Live Chat</h3>
                    <p className="text-gray-600">Available on website</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM IST</p>
                  </div>
                </div>
                
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>
            
            {/* Support Ticket Form */}
            <Card>
              <CardHeader>
                <CardTitle>Submit Support Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={ticketForm.email}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={ticketForm.category} onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="tournament">Tournament Problems</SelectItem>
                        <SelectItem value="payment">Payment Issues</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Describe your issue in detail..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-fire-red hover:bg-fire-red/90">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="guides" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-fire-red/10 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-fire-red" />
                </div>
                <h3 className="font-semibold mb-2">Tournament Guide</h3>
                <p className="text-gray-600 text-sm mb-4">Learn how to join, play, and win tournaments</p>
                <Button variant="ghost" className="p-0 h-auto text-fire-red hover:text-fire-red/80">
                  Read Guide <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-fire-blue/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-fire-blue" />
                </div>
                <h3 className="font-semibold mb-2">Team Management</h3>
                <p className="text-gray-600 text-sm mb-4">Create and manage your gaming teams effectively</p>
                <Button variant="ghost" className="p-0 h-auto text-fire-red hover:text-fire-red/80">
                  Read Guide <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-fire-yellow/10 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-fire-yellow" />
                </div>
                <h3 className="font-semibold mb-2">Wallet & Payments</h3>
                <p className="text-gray-600 text-sm mb-4">Manage your wallet, deposits, and withdrawals</p>
                <Button variant="ghost" className="p-0 h-auto text-fire-red hover:text-fire-red/80">
                  Read Guide <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="policies" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-6 h-6 text-fire-red" />
                  <h3 className="text-lg font-semibold">Terms of Service</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Read our complete terms and conditions governing the use of Fire Fight platform.
                </p>
                <Button variant="outline" className="w-full">
                  View Terms <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-fire-blue" />
                  <h3 className="text-lg font-semibold">Privacy Policy</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Learn how we collect, use, and protect your personal information.
                </p>
                <Button variant="outline" className="w-full">
                  View Policy <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="w-6 h-6 text-fire-yellow" />
                  <h3 className="text-lg font-semibold">Fair Play Policy</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Our commitment to fair gaming and anti-cheating measures.
                </p>
                <Button variant="outline" className="w-full">
                  Read Policy <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CreditCard className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-semibold">Refund Policy</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Information about refunds, cancellations, and payment disputes.
                </p>
                <Button variant="outline" className="w-full">
                  View Policy <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
