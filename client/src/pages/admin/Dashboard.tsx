import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Trophy, 
  DollarSign, 
  Gamepad2, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  AlertCircle
} from "lucide-react";
import { formatCurrency, formatDate, getTournamentStatusColor, getTournamentStatusText } from "@/lib/utils";

export default function Dashboard() {
  // Fetch dashboard data
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

  // Calculate stats
  const totalUsers = users.length;
  const totalTournaments = tournaments.length;
  const activeTournaments = tournaments.filter((t: any) => t.status === 'live' || t.status === 'upcoming').length;
  const totalRevenue = transactions
    .filter((t: any) => t.type === 'tournament_entry')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const recentUsers = users
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentTournaments = tournaments
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const pendingWithdrawals = transactions.filter((t: any) => t.type === 'withdrawal' && t.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-fire-red">{totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-fire-red/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-fire-red" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-gray-600 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tournaments</p>
                <p className="text-3xl font-bold text-fire-yellow">{activeTournaments}</p>
              </div>
              <div className="w-12 h-12 bg-fire-yellow/10 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-fire-yellow" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+8%</span>
              <span className="text-gray-600 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-fire-blue">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-fire-blue/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-fire-blue" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+15%</span>
              <span className="text-gray-600 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Matches</p>
                <p className="text-3xl font-bold text-green-500">{totalTournaments}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+22%</span>
              <span className="text-gray-600 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {pendingWithdrawals > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">Pending Actions Required</p>
                <p className="text-sm text-orange-700">
                  {pendingWithdrawals} withdrawal request{pendingWithdrawals !== 1 ? 's' : ''} pending approval
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tournaments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tournaments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTournaments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tournaments yet</p>
              ) : (
                recentTournaments.map((tournament: any) => (
                  <div key={tournament.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{tournament.title}</h4>
                      <p className="text-sm text-gray-600">
                        {tournament.currentParticipants}/{tournament.maxParticipants} participants • {formatCurrency(tournament.prizePool)} prize
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(tournament.createdAt)}</p>
                    </div>
                    <Badge className={`${getTournamentStatusColor(tournament.status)} text-white`}>
                      {getTournamentStatusText(tournament.status)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No users yet</p>
              ) : (
                recentUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-fire-red text-white">
                        {user.fullName?.split(' ').map((n: string) => n[0]).join('') || user.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{user.fullName}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                    </div>
                    {user.isAdmin && (
                      <Badge variant="outline" className="text-fire-red border-fire-red">
                        Admin
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Tournament Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Live Tournaments:</span>
                <span className="font-semibold">{tournaments.filter((t: any) => t.status === 'live').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Upcoming:</span>
                <span className="font-semibold">{tournaments.filter((t: any) => t.status === 'upcoming').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-semibold">{tournaments.filter((t: any) => t.status === 'ended').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Prize Pool:</span>
                <span className="font-semibold fire-red">
                  {formatCurrency(tournaments.reduce((sum: number, t: any) => sum + t.prizePool, 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">User Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Active Users:</span>
                <span className="font-semibold">{users.filter((u: any) => u.isActive).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Admin Users:</span>
                <span className="font-semibold">{users.filter((u: any) => u.isAdmin).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Teams:</span>
                <span className="font-semibold">{teams.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Wallet Balance:</span>
                <span className="font-semibold fire-blue">
                  {formatCurrency(users.reduce((sum: number, u: any) => sum + (u.walletBalance || 0), 0) / Math.max(users.length, 1))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Financial Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Deposits:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(transactions
                    .filter((t: any) => t.type === 'deposit')
                    .reduce((sum: number, t: any) => sum + t.amount, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Withdrawals:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(transactions
                    .filter((t: any) => t.type === 'withdrawal' && t.status === 'completed')
                    .reduce((sum: number, t: any) => sum + t.amount, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Withdrawals:</span>
                <span className="font-semibold text-orange-600">
                  {formatCurrency(transactions
                    .filter((t: any) => t.type === 'withdrawal' && t.status === 'pending')
                    .reduce((sum: number, t: any) => sum + t.amount, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Revenue:</span>
                <span className="font-semibold fire-red">
                  {formatCurrency(totalRevenue * 0.1)} {/* Assuming 10% platform fee */}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}