import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import GameCard from "@/components/GameCard";
import TournamentCard from "@/components/TournamentCard";
import PlayerCard from "@/components/PlayerCard";
import JoinTournamentModal from "@/components/modals/JoinTournamentModal";
import { Tournament, Game, User } from "@shared/schema";
import { UserPlus, Search, Gamepad2, Trophy, Copy } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const { data: tournaments } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { data: leaderboard } = useQuery<User[]>({
    queryKey: ["/api/leaderboard"],
  });

  const featuredTournaments = tournaments?.slice(0, 3) || [];
  const topPlayers = leaderboard?.slice(0, 6) || [];

  const handleJoinTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setJoinModalOpen(true);
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        ></div>
        
        <div className="relative z-20 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float">
            <span className="gradient-text">Fire Fight</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Join the ultimate gaming tournament platform. Compete, Win, Dominate!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg">
              <Link href="/tournaments">Start Gaming</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg">
              <Link href="/leaderboard">Watch Tournaments</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Choose Your <span className="text-red-500">Battle</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {games?.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                playerCount={Math.floor(Math.random() * 20) + 5} // Mock player count
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Featured <span className="text-red-500">Tournaments</span>
            </h2>
            <Button variant="ghost" asChild className="text-red-500 hover:text-red-600">
              <Link href="/tournaments">
                View All <span className="ml-1">→</span>
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                game={games?.find(g => g.id === tournament.gameId)}
                onJoin={() => handleJoinTournament(tournament)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Top Players */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Top <span className="text-red-500">Players</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {topPlayers.map((player, index) => (
              <PlayerCard
                key={player.id}
                user={player}
                rank={index + 1}
                points={Math.floor(parseFloat(player.walletBalance) + player.bonusCoins)}
                game={games?.[Math.floor(Math.random() * (games?.length || 1))]?.name}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It <span className="text-red-500">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Sign Up</h3>
              <p className="text-gray-600">Create your account and complete your gaming profile</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Find Tournaments</h3>
              <p className="text-gray-600">Browse and select tournaments that match your skill level</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Play & Compete</h3>
              <p className="text-gray-600">Join tournaments, compete with other players, and climb rankings</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Win Rewards</h3>
              <p className="text-gray-600">Earn cash prizes and rewards for your performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-red-500 to-yellow-500 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Invite Friends & Earn More
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Get ₹50 for every friend who joins and plays their first tournament
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-lg font-mono">
                {user?.referralCode || "LOADING..."}
              </div>
              <Button
                className="bg-white text-red-500 hover:bg-gray-100"
                onClick={copyReferralCode}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>
          </div>
        </div>
      </section>

      <JoinTournamentModal
        open={joinModalOpen}
        onOpenChange={setJoinModalOpen}
        tournament={selectedTournament}
      />
    </div>
  );
}
