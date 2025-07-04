import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Trophy, 
  DollarSign,
  Download,
  Calendar,
  Target
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminReports() {
  const [timeRange, setTimeRange] = useState("30d");

  // Fetch data for reports
  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  const { data: tournaments = [] } = useQuery({
    queryKey: ["/api/tournaments"],
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["/api/teams"],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/admin/transactions"],
  });

  // Calculate metrics
  const totalUsers = users.length;
  const totalTournaments = tournaments.length;
  const totalRevenue = transactions
    .filter((t: any) => t.type === 'tournament_entry')
    .reduce((sum: number, t: any) => sum + t.amount, 0);
  
  const totalDeposits = transactions
    .filter((t: any) => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter((t: any) => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const activeTournaments = tournaments.filter((t: any) => t.status === 'live' || t.status === 'upcoming').length;
  const completedTournaments = tournaments.filter((t: any) => t.status === 'ended').length;

  // Get recent data based on time range
  const getRecentData = (days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return {
      users: users.filter((u: any) => new Date(u.createdAt) >= cutoff),
      tournaments: tournaments.filter((t: any) => new Date(t.createdAt) >= cutoff),
      transactions: transactions.filter((t: any) => new Date(t.createdAt) >= cutoff),
    };
  };

  const getDaysFromTimeRange = (range: string) => {
    switch (range) {
      case "7d": return 7;
      case "30d": return 30;
      case "90d": return 90;
      default: return 30;
    }
  };

  const recentData = getRecentData(getDaysFromTimeRange(timeRange));

  // Top performing tournaments
  const topTournaments = tournaments
    .sort((a: any, b: any) => b.currentParticipants - a.currentParticipants)
    .slice(0, 5);

  // User growth data (mock for visualization)
  const userGrowthData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    users: Math.floor(Math.random() * 50) + 10,
  }));

  const exportReport = () => {
    // Generate CSV data
    const reportData = {
      summary: {
        totalUsers,
        totalTournaments,
        totalRevenue: formatCurrency(totalRevenue),
        totalDeposits: formatCurrency(totalDeposits),
        totalWithdrawals: formatCurrency(totalWithdrawals),
        activeTournaments,
        completedTournaments,
      },
      recentUsers: recentData.users.length,
      recentTournaments: recentData.tournaments.length,
      recentTransactions: recentData.transactions.length,
    };

    // Create CSV content
    const csvContent = `Fire Fight Platform Report - ${new Date().toLocaleDateString()}\n\n` +
      `Total Users,${totalUsers}\n` +
      `Total Tournaments,${totalTournaments}\n` +
      `Total Revenue,${totalRevenue}\n` +
      `Total Deposits,${totalDeposits}\n` +
      `Total Withdrawals,${totalWithdrawals}\n` +
      `Active Tournaments,${activeTournaments}\n` +
      `Completed Tournaments,${completedTournaments}\n`;

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fire-fight-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">Platform performance and insights</p>
        </div>
        <div className="flex space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} className="bg-fire-red hover:bg-fire-red/90">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-fire-red">{totalUsers}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{recentData.users.length} this {timeRange}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-fire-red" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tournaments</p>
                    <p className="text-3xl font-bold text-fire-yellow">{totalTournaments}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{recentData.tournaments.length} this {timeRange}
                    </p>
                  </div>
                  <Trophy className="w-8 h-8 text-fire-yellow" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                    <p className="text-3xl font-bold text-fire-blue">{formatCurrency(totalRevenue * 0.1)}</p>
                    <p className="text-sm text-gray-600 mt-1">10% of entry fees</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-fire-blue" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Tournaments</p>
                    <p className="text-3xl font-bold text-green-600">{activeTournaments}</p>
                    <p className="text-sm text-gray-600 mt-1">Live & Upcoming</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                    <p>User growth chart would be displayed here</p>
                    <p className="text-sm">Integration with chart library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tournament Entries</span>
                    <span className="font-semibold">{formatCurrency(totalRevenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-fire-red h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Platform Fees</span>
                    <span className="font-semibold">{formatCurrency(totalRevenue * 0.1)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-fire-blue h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prize Pools</span>
                    <span className="font-semibold">{formatCurrency(totalRevenue * 0.9)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-fire-yellow h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Tournaments */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Tournaments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTournaments.map((tournament: any, index: number) => (
                  <div key={tournament.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-fire-red rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{tournament.title}</h4>
                        <p className="text-sm text-gray-600">
                          {tournament.currentParticipants}/{tournament.maxParticipants} participants
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(tournament.prizePool)}</div>
                      <div className="text-sm text-gray-600">{tournament.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fire-red">{recentData.users.length}</div>
                  <div className="text-sm text-gray-600">New users in {timeRange}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{users.filter((u: any) => u.isActive).length}</div>
                  <div className="text-sm text-gray-600">Currently active</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avg. Wallet Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fire-blue">
                    {formatCurrency(users.reduce((sum: number, u: any) => sum + (u.walletBalance || 0), 0) / Math.max(users.length, 1))}
                  </div>
                  <div className="text-sm text-gray-600">Per user</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tournaments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {tournaments.filter((t: any) => t.status === 'live').length}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {tournaments.filter((t: any) => t.status === 'upcoming').length}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">
                    {tournaments.filter((t: any) => t.status === 'ended').length}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avg. Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fire-red">
                    {Math.round(tournaments.reduce((sum: number, t: any) => sum + (t.currentParticipants || 0), 0) / Math.max(tournaments.length, 1))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Deposits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(totalDeposits)}</div>
                  <div className="text-sm text-gray-600">All time</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Withdrawals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{formatCurrency(totalWithdrawals)}</div>
                  <div className="text-sm text-gray-600">All time</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fire-blue">{formatCurrency(totalDeposits - totalWithdrawals)}</div>
                  <div className="text-sm text-gray-600">Platform balance</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
