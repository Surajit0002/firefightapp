import { 
  users, games, tournaments, teams, teamMembers, tournamentParticipants, 
  transactions, notifications, tournamentResults,
  type User, type InsertUser, type Game, type InsertGame,
  type Tournament, type InsertTournament, type Team, type InsertTeam,
  type TeamMember, type InsertTeamMember, type TournamentParticipant, type InsertTournamentParticipant,
  type Transaction, type InsertTransaction, type Notification, type InsertNotification,
  type TournamentResult, type InsertTournamentResult
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserWallet(id: number, amount: string): Promise<User>;
  
  // Game operations
  getAllGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Tournament operations
  getAllTournaments(): Promise<Tournament[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: number, tournament: Partial<Tournament>): Promise<Tournament>;
  deleteTournament(id: number): Promise<void>;
  
  // Team operations
  getAllTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  getTeamByJoinCode(joinCode: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<Team>): Promise<Team>;
  deleteTeam(id: number): Promise<void>;
  getUserTeams(userId: number): Promise<Team[]>;
  
  // Team member operations
  addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  removeTeamMember(teamId: number, userId: number): Promise<void>;
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  
  // Tournament participant operations
  addTournamentParticipant(participant: InsertTournamentParticipant): Promise<TournamentParticipant>;
  removeTournamentParticipant(tournamentId: number, userId: number): Promise<void>;
  getTournamentParticipants(tournamentId: number): Promise<TournamentParticipant[]>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  getAllTransactions(): Promise<Transaction[]>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<void>;
  
  // Tournament result operations
  createTournamentResult(result: InsertTournamentResult): Promise<TournamentResult>;
  getTournamentResults(tournamentId: number): Promise<TournamentResult[]>;
  
  // Leaderboard operations
  getLeaderboard(): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private games: Map<number, Game> = new Map();
  private tournaments: Map<number, Tournament> = new Map();
  private teams: Map<number, Team> = new Map();
  private teamMembers: Map<number, TeamMember> = new Map();
  private tournamentParticipants: Map<number, TournamentParticipant> = new Map();
  private transactions: Map<number, Transaction> = new Map();
  private notifications: Map<number, Notification> = new Map();
  private tournamentResults: Map<number, TournamentResult> = new Map();
  
  private currentUserId = 1;
  private currentGameId = 1;
  private currentTournamentId = 1;
  private currentTeamId = 1;
  private currentTeamMemberId = 1;
  private currentTournamentParticipantId = 1;
  private currentTransactionId = 1;
  private currentNotificationId = 1;
  private currentTournamentResultId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed games
    const gameData = [
      { name: "Free Fire", slug: "free-fire", description: "Battle Royale", image: "", category: "Battle Royale", isActive: true },
      { name: "PUBG", slug: "pubg", description: "Battle Royale", image: "", category: "Battle Royale", isActive: true },
      { name: "Call of Duty", slug: "cod", description: "FPS", image: "", category: "FPS", isActive: true },
      { name: "Apex Legends", slug: "apex", description: "Battle Royale", image: "", category: "Battle Royale", isActive: true },
      { name: "Valorant", slug: "valorant", description: "FPS", image: "", category: "FPS", isActive: true },
      { name: "CS:GO", slug: "csgo", description: "FPS", image: "", category: "FPS", isActive: true },
    ];

    gameData.forEach(game => {
      const newGame: Game = { ...game, id: this.currentGameId++ };
      this.games.set(newGame.id, newGame);
    });

    // Seed admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      email: "admin@firefight.com",
      password: "admin123",
      phone: "+1234567890",
      country: "US",
      avatar: "",
      walletBalance: "10000.00",
      bonusCoins: 1000,
      referralCode: "ADMIN001",
      referredBy: null,
      isAdmin: true,
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Seed demo user
    const demoUser: User = {
      id: this.currentUserId++,
      username: "johndoe",
      email: "john@example.com",
      password: "demo123",
      phone: "+9876543210",
      country: "IN",
      avatar: "",
      walletBalance: "2450.00",
      bonusCoins: 850,
      referralCode: "JOHN001",
      referredBy: null,
      isAdmin: false,
      createdAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);

    // Seed tournaments
    const tournamentData = [
      {
        title: "Free Fire Championship",
        gameId: 1,
        description: "Ultimate Battle Royale Championship with top players",
        entryFee: "250.00",
        prizePool: "25000.00",
        maxParticipants: 50,
        currentParticipants: 32,
        mode: "squad",
        status: "live",
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        endTime: null,
        roomCode: "FF2024XYZ",
        roomPassword: "fire123",
        rules: "Follow fair play rules",
        createdAt: new Date(),
      },
      {
        title: "PUBG Arena Masters",
        gameId: 2,
        description: "Elite tournament for experienced PUBG players",
        entryFee: "150.00",
        prizePool: "15000.00",
        maxParticipants: 20,
        currentParticipants: 8,
        mode: "solo",
        status: "upcoming",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endTime: null,
        roomCode: null,
        roomPassword: null,
        rules: "No cheating allowed",
        createdAt: new Date(),
      },
    ];

    tournamentData.forEach(tournament => {
      const newTournament: Tournament = { ...tournament, id: this.currentTournamentId++ };
      this.tournaments.set(newTournament.id, newTournament);
    });

    // Seed team
    const team: Team = {
      id: this.currentTeamId++,
      name: "Fire Fighters",
      logo: "",
      country: "IN",
      captainId: demoUser.id,
      joinCode: "FF2024XYZ",
      maxMembers: 6,
      currentMembers: 4,
      wins: 24,
      matchesPlayed: 36,
      rank: 12,
      createdAt: new Date(),
    };
    this.teams.set(team.id, team);

    // Seed team member
    const teamMember: TeamMember = {
      id: this.currentTeamMemberId++,
      teamId: team.id,
      userId: demoUser.id,
      role: "captain",
      joinedAt: new Date(),
    };
    this.teamMembers.set(teamMember.id, teamMember);

    // Seed transactions
    const transactionData = [
      {
        userId: demoUser.id,
        type: "tournament_win",
        amount: "1250.00",
        description: "Tournament Win - Free Fire Championship",
        status: "completed",
        createdAt: new Date(),
      },
      {
        userId: demoUser.id,
        type: "tournament_entry",
        amount: "-150.00",
        description: "Tournament Entry - PUBG Arena Masters",
        status: "completed",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        userId: demoUser.id,
        type: "referral_bonus",
        amount: "50.00",
        description: "Referral Bonus - Friend joined",
        status: "completed",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    transactionData.forEach(transaction => {
      const newTransaction: Transaction = { ...transaction, id: this.currentTransactionId++ };
      this.transactions.set(newTransaction.id, newTransaction);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const referralCode = `USER${String(this.currentUserId).padStart(3, '0')}`;
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      walletBalance: "0.00",
      bonusCoins: 0,
      referralCode,
      isAdmin: false,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUserWallet(id: number, amount: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const currentBalance = parseFloat(user.walletBalance);
    const newBalance = currentBalance + parseFloat(amount);
    
    const updatedUser = { ...user, walletBalance: newBalance.toFixed(2) };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Game operations
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const game: Game = { ...insertGame, id: this.currentGameId++ };
    this.games.set(game.id, game);
    return game;
  }

  // Tournament operations
  async getAllTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values());
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const tournament: Tournament = {
      ...insertTournament,
      id: this.currentTournamentId++,
      currentParticipants: 0,
      createdAt: new Date(),
    };
    this.tournaments.set(tournament.id, tournament);
    return tournament;
  }

  async updateTournament(id: number, updateData: Partial<Tournament>): Promise<Tournament> {
    const tournament = this.tournaments.get(id);
    if (!tournament) throw new Error("Tournament not found");
    
    const updatedTournament = { ...tournament, ...updateData };
    this.tournaments.set(id, updatedTournament);
    return updatedTournament;
  }

  async deleteTournament(id: number): Promise<void> {
    this.tournaments.delete(id);
  }

  // Team operations
  async getAllTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async getTeamByJoinCode(joinCode: string): Promise<Team | undefined> {
    return Array.from(this.teams.values()).find(team => team.joinCode === joinCode);
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const joinCode = `TEAM${String(this.currentTeamId).padStart(3, '0')}`;
    const team: Team = {
      ...insertTeam,
      id: this.currentTeamId++,
      joinCode,
      currentMembers: 1,
      wins: 0,
      matchesPlayed: 0,
      rank: 0,
      createdAt: new Date(),
    };
    this.teams.set(team.id, team);
    return team;
  }

  async updateTeam(id: number, updateData: Partial<Team>): Promise<Team> {
    const team = this.teams.get(id);
    if (!team) throw new Error("Team not found");
    
    const updatedTeam = { ...team, ...updateData };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  async deleteTeam(id: number): Promise<void> {
    this.teams.delete(id);
  }

  async getUserTeams(userId: number): Promise<Team[]> {
    const userTeamMemberships = Array.from(this.teamMembers.values()).filter(
      member => member.userId === userId
    );
    return userTeamMemberships.map(member => this.teams.get(member.teamId!)).filter(Boolean) as Team[];
  }

  // Team member operations
  async addTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const teamMember: TeamMember = {
      ...insertTeamMember,
      id: this.currentTeamMemberId++,
      joinedAt: new Date(),
    };
    this.teamMembers.set(teamMember.id, teamMember);
    
    // Update team member count
    const team = this.teams.get(teamMember.teamId!);
    if (team) {
      team.currentMembers++;
      this.teams.set(team.id, team);
    }
    
    return teamMember;
  }

  async removeTeamMember(teamId: number, userId: number): Promise<void> {
    const memberToRemove = Array.from(this.teamMembers.values()).find(
      member => member.teamId === teamId && member.userId === userId
    );
    
    if (memberToRemove) {
      this.teamMembers.delete(memberToRemove.id);
      
      // Update team member count
      const team = this.teams.get(teamId);
      if (team) {
        team.currentMembers--;
        this.teams.set(team.id, team);
      }
    }
  }

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(
      member => member.teamId === teamId
    );
  }

  // Tournament participant operations
  async addTournamentParticipant(insertParticipant: InsertTournamentParticipant): Promise<TournamentParticipant> {
    const participant: TournamentParticipant = {
      ...insertParticipant,
      id: this.currentTournamentParticipantId++,
      joinedAt: new Date(),
    };
    this.tournamentParticipants.set(participant.id, participant);
    
    // Update tournament participant count
    const tournament = this.tournaments.get(participant.tournamentId!);
    if (tournament) {
      tournament.currentParticipants++;
      this.tournaments.set(tournament.id, tournament);
    }
    
    return participant;
  }

  async removeTournamentParticipant(tournamentId: number, userId: number): Promise<void> {
    const participantToRemove = Array.from(this.tournamentParticipants.values()).find(
      participant => participant.tournamentId === tournamentId && participant.userId === userId
    );
    
    if (participantToRemove) {
      this.tournamentParticipants.delete(participantToRemove.id);
      
      // Update tournament participant count
      const tournament = this.tournaments.get(tournamentId);
      if (tournament) {
        tournament.currentParticipants--;
        this.tournaments.set(tournament.id, tournament);
      }
    }
  }

  async getTournamentParticipants(tournamentId: number): Promise<TournamentParticipant[]> {
    return Array.from(this.tournamentParticipants.values()).filter(
      participant => participant.tournamentId === tournamentId
    );
  }

  // Transaction operations
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const transaction: Transaction = {
      ...insertTransaction,
      id: this.currentTransactionId++,
      createdAt: new Date(),
    };
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      transaction => transaction.userId === userId
    ).sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort(
      (a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()
    );
  }

  // Notification operations
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const notification: Notification = {
      ...insertNotification,
      id: this.currentNotificationId++,
      createdAt: new Date(),
    };
    this.notifications.set(notification.id, notification);
    return notification;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      notification => notification.userId === userId
    ).sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async markNotificationAsRead(id: number): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.read = true;
      this.notifications.set(id, notification);
    }
  }

  // Tournament result operations
  async createTournamentResult(insertResult: InsertTournamentResult): Promise<TournamentResult> {
    const result: TournamentResult = {
      ...insertResult,
      id: this.currentTournamentResultId++,
    };
    this.tournamentResults.set(result.id, result);
    return result;
  }

  async getTournamentResults(tournamentId: number): Promise<TournamentResult[]> {
    return Array.from(this.tournamentResults.values()).filter(
      result => result.tournamentId === tournamentId
    ).sort((a, b) => a.position - b.position);
  }

  // Leaderboard operations
  async getLeaderboard(): Promise<User[]> {
    const users = Array.from(this.users.values()).filter(user => !user.isAdmin);
    // Sort by wallet balance and bonus coins combined
    return users.sort((a, b) => {
      const aTotal = parseFloat(a.walletBalance) + a.bonusCoins;
      const bTotal = parseFloat(b.walletBalance) + b.bonusCoins;
      return bTotal - aTotal;
    });
  }
}

export const storage = new MemStorage();
