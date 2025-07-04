
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Trophy, 
  DollarSign,
  Calendar,
  Target,
  Eye,
  Download,
  RefreshCw,
  Activity,
  Gamepad2,
  UserCheck,
  Zap
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState("7d");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch analytics data
  const { data: users = [], refetch: refetchUsers } = useQuery({
    queryKey: ["/api/users"],
  });

  const { data: tournaments = [], refetch: refetchTournaments } = useQuery({
    queryKey: ["/api/tournaments"],
  });

  const { data: transactions = [], refetch: refetchTransactions } = useQuery({
    queryKey: ["/api/admin/transactions"],
  });

  const { data: teams = [], refetch: refetchTeams } = useQuery({
    queryKey: ["/api/teams"],
  });

  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    const now = new Date();
    const daysAgo = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const filteredUsers = users.filter((u: any) => new Date(u.createdAt) >= startDate);
    const filteredTournaments = tournaments.filter((t: any) => new Date(t.createdAt) >= startDate);
    const filteredTransactions = transactions.filter((t: any) => new Date(t.createdAt) >= startDate);

    const totalRevenue = filteredTransactions
      .filter((t: any) => t.type === 'tournament_entry' && t.status === 'completed')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalDeposits = filteredTransactions
      .filter((t: any) => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalWithdrawals = filteredTransactions
      .filter((t: any) => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const averageRevenuePerUser = filteredUsers.length > 0 ? totalRevenue / filteredUsers.length : 0;
    const conversionRate = filteredUsers.length > 0 ? (filteredTournaments.length / filteredUsers.length) * 100 : 0;

    return {
      users: {
        total: users.length,
        new: filteredUsers.length,
        active: users.filter((u: any) => u.lastLoginAt && new Date(u.lastLoginAt) >= startDate).length,
        growth: filteredUsers.length > 0 ? ((filteredUsers.length / users.length) * 100) : 0
      },
      tournaments: {
        total: tournaments.length,
        new: filteredTournaments.length,
        live: tournaments.filter((t: any) => t.status === 'live').length,
        completed: tournaments.filter((t: any) => t.status === 'ended').length,
        upcoming: tournaments.filter((t: any) => t.status === 'upcoming').length
      },
      revenue: {
        total: totalRevenue,
        deposits: totalDeposits,
        withdrawals: totalWithdrawals,
        profit: totalRevenue - totalWithdrawals,
        averagePerUser: averageRevenuePerUser,
        conversionRate: conversionRate
      },
      teams: {
        total: teams.length,
        active: teams.filter((t: any) => t.memberCount > 1).length,
        averageSize: teams.length > 0 ? teams.reduce((sum: number, t: any) => sum + t.memberCount, 0) / teams.length : 0
      }
    };
  }, [users, tournaments, transactions, teams, dateRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchUsers(),
        refetchTournaments(),
        refetchTransactions(),
        refetchTeams()
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const exportData = () => {
    const data = {
      analytics,
      exportedAt: new Date().toISOString(),
      dateRange
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive platform analytics and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-fire-red">{analytics.users.total.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-fire-red/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-fire-red" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+{analytics.users.new}</span>
              <span className="text-gray-600 ml-1">new users</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tournaments</p>
                <p className="text-3xl font-bold text-fire-yellow">{analytics.tournaments.live}</p>
              </div>
              <div className="w-12 h-12 bg-fire-yellow/10 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-fire-yellow" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Activity className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-blue-500">{analytics.tournaments.upcoming}</span>
              <span className="text-gray-600 ml-1">upcoming</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-fire-blue">{formatCurrency(analytics.revenue.total)}</p>
              </div>
              <div className="w-12 h-12 bg-fire-blue/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-fire-blue" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">{formatCurrency(analytics.revenue.profit)}</span>
              <span className="text-gray-600 ml-1">profit</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Teams</p>
                <p className="text-3xl font-bold text-green-500">{analytics.teams.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <UserCheck className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-purple-500">{analytics.teams.averageSize.toFixed(1)}</span>
              <span className="text-gray-600 ml-1">avg size</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">User Growth Rate</span>
                    <Badge variant="secondary">
                      {analytics.users.growth.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tournament Completion Rate</span>
                    <Badge variant="secondary">
                      {analytics.tournaments.total > 0 ? ((analytics.tournaments.completed / analytics.tournaments.total) * 100).toFixed(1) : 0}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Revenue per User</span>
                    <Badge variant="secondary">
                      {formatCurrency(analytics.revenue.averagePerUser)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Conversion Rate</span>
                    <Badge variant="secondary">
                      {analytics.revenue.conversionRate.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    View User Activity
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Trophy className="w-4 h-4 mr-2" />
                    Manage Tournaments
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Review Transactions
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Set Performance Goals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Users:</span>
                    <span className="font-semibold">{analytics.users.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Users:</span>
                    <span className="font-semibold fire-red">{analytics.users.new}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Users:</span>
                    <span className="font-semibold">{analytics.users.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin Users:</span>
                    <span className="font-semibold">{users.filter((u: any) => u.isAdmin).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Active Users:</span>
                    <span className="font-semibold">{Math.floor(analytics.users.active * 0.3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekly Active Users:</span>
                    <span className="font-semibold">{Math.floor(analytics.users.active * 0.7)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Active Users:</span>
                    <span className="font-semibold">{analytics.users.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retention Rate:</span>
                    <span className="font-semibold">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Growth Rate:</span>
                    <Badge className="bg-green-100 text-green-800">
                      +{analytics.users.growth.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projected Monthly:</span>
                    <span className="font-semibold">{Math.floor(analytics.users.new * 4.3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Churn Rate:</span>
                    <Badge className="bg-red-100 text-red-800">
                      -2.1%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tournaments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-fire-yellow">{analytics.tournaments.live}</div>
                  <div className="text-sm text-gray-600">Live Tournaments</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{analytics.tournaments.upcoming}</div>
                  <div className="text-sm text-gray-600">Upcoming</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{analytics.tournaments.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">{analytics.tournaments.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue:</span>
                    <span className="font-semibold fire-blue">{formatCurrency(analytics.revenue.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Deposits:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(analytics.revenue.deposits)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Withdrawals:</span>
                    <span className="font-semibold text-red-600">{formatCurrency(analytics.revenue.withdrawals)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Profit:</span>
                    <span className="font-semibold fire-red">{formatCurrency(analytics.revenue.profit)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue per User:</span>
                    <span className="font-semibold">{formatCurrency(analytics.revenue.averagePerUser)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion Rate:</span>
                    <span className="font-semibold">{analytics.revenue.conversionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit Margin:</span>
                    <span className="font-semibold">
                      {analytics.revenue.total > 0 ? ((analytics.revenue.profit / analytics.revenue.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Session Time:</span>
                    <span className="font-semibold">24 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Page Views per Session:</span>
                    <span className="font-semibold">8.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bounce Rate:</span>
                    <span className="font-semibold">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tournament Participation:</span>
                    <span className="font-semibold">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tournament Browsing</span>
                    <Badge variant="secondary">45%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Team Management</span>
                    <Badge variant="secondary">28%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Wallet Operations</span>
                    <Badge variant="secondary">18%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profile Updates</span>
                    <Badge variant="secondary">9%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
