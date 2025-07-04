import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PlayerCard from "@/components/PlayerCard";
import { User, Team } from "@shared/schema";
import { Trophy, Medal, Award, Filter } from "lucide-react";
import { countries } from "@/lib/countries";

export default function Leaderboard() {
  const [filter, setFilter] = useState("global");
  const [timeFilter, setTimeFilter] = useState("all-time");

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/leaderboard"],
  });

  const { data: teams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const topPlayers = users?.slice(0, 3) || [];
  const otherPlayers = users?.slice(3) || [];

  const topTeams = teams?.sort((a, b) => b.wins - a.wins).slice(0, 10) || [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <div className="flex space-x-4">
          <Button
            variant={filter === "global" ? "default" : "outline"}
            onClick={() => setFilter("global")}
            className={filter === "global" ? "bg-red-500 hover:bg-red-600" : ""}
          >
            Global
          </Button>
          <Button
            variant={filter === "teams" ? "default" : "outline"}
            onClick={() => setFilter("teams")}
            className={filter === "teams" ? "bg-red-500 hover:bg-red-600" : ""}
          >
            Teams
          </Button>
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex justify-center space-x-4 mb-8">
        {["all-time", "monthly", "weekly"].map((time) => (
          <Button
            key={time}
            variant={timeFilter === time ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter(time)}
            className={timeFilter === time ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            {time === "all-time" ? "All Time" : time.charAt(0).toUpperCase() + time.slice(1)}
          </Button>
        ))}
      </div>

      {filter === "global" ? (
        <>
          {/* Top 3 Players Podium */}
          {topPlayers.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-center mb-8">
                Top <span className="text-red-500">Champions</span>
              </h2>
              
              <div className="flex justify-center items-end space-x-8">
                {/* 2nd Place */}
                {topPlayers[1] && (
                  <div className="text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-32 bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-lg flex items-start justify-center pt-4">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <PlayerCard user={topPlayers[1]} rank={2} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {topPlayers[0] && (
                  <div className="text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-40 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg flex items-start justify-center pt-4">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <PlayerCard user={topPlayers[0]} rank={1} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {topPlayers[2] && (
                  <div className="text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-24 bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-lg flex items-start justify-center pt-4">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <PlayerCard user={topPlayers[2]} rank={3} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other Players Table */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">Global Ranking</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Wallet Balance</TableHead>
                    <TableHead>Bonus Coins</TableHead>
                    <TableHead>Total Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user, index) => {
                    const country = countries.find(c => c.code === user.country);
                    const totalScore = parseFloat(user.walletBalance) + user.bonusCoins;
                    return (
                      <TableRow key={user.id} className={index < 3 ? getRankBg(index + 1) : ""}>
                        <TableCell>
                          <div className="flex items-center">
                            {getRankIcon(index + 1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback className="bg-red-500 text-white">
                                {user.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{user.username}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {country && (
                              <>
                                <span>{country.flag}</span>
                                <span className="text-sm">{country.name}</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-green-600">₹{user.walletBalance}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-blue-600">{user.bonusCoins}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-red-500">{totalScore.toFixed(0)}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Teams Leaderboard */
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6">Top Teams</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Wins</TableHead>
                  <TableHead>Matches</TableHead>
                  <TableHead>Win Rate</TableHead>
                  <TableHead>Members</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topTeams.map((team, index) => {
                  const country = countries.find(c => c.code === team.country);
                  const winRate = team.matchesPlayed > 0 ? ((team.wins / team.matchesPlayed) * 100).toFixed(1) : "0.0";
                  return (
                    <TableRow key={team.id} className={index < 3 ? getRankBg(index + 1) : ""}>
                      <TableCell>
                        <div className="flex items-center">
                          {getRankIcon(index + 1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {team.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-semibold">{team.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {country && (
                            <>
                              <span>{country.flag}</span>
                              <span className="text-sm">{country.name}</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">{team.wins}</span>
                      </TableCell>
                      <TableCell>{team.matchesPlayed}</TableCell>
                      <TableCell>
                        <Badge variant={parseFloat(winRate) > 50 ? "default" : "outline"}>
                          {winRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {team.currentMembers}/{team.maxMembers}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
